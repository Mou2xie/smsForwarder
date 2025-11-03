import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import * as SMS from 'expo-sms';
import { NativeEventEmitter, NativeModules, PermissionsAndroid, Platform } from 'react-native';

export type MessageLogItem = {
  id: string;
  sender: string;
  preview: string;
  forwardedAt: string;
};

export type BlockedEntry = {
  id: string;
  label: string;
};

type ForwardingStoreValue = {
  forwardingEnabled: boolean;
  forwardingNumber: string;
  messageLog: MessageLogItem[];
  blacklist: BlockedEntry[];
  toggleForwarding: (enabled: boolean) => void;
  updateForwardingNumber: (value: string) => void;
  recordForwardedMessage: (entry: {
    sender: string;
    preview: string;
    forwardedAt?: Date | string;
  }) => void;
  addBlockedEntry: (label: string) => { success: boolean; reason?: string };
  removeBlockedEntry: (id: string) => void;
  isSenderBlocked: (label: string) => boolean;
  forwardIncomingMessage: (payload: ForwardMessagePayload) => Promise<ForwardMessageResult>;
};

export type ForwardMessagePayload = {
  sender: string;
  body: string;
  receivedAt?: Date | string;
};

export type ForwardMessageResult =
  | { success: true }
  | {
    success: false;
    reason:
      | 'DISABLED'
      | 'MISSING_FORWARD_NUMBER'
      | 'BLACKLISTED'
      | 'SMS_UNAVAILABLE'
      | 'FAILED'
      | 'CANCELLED';
    error?: Error;
  };

const ForwardingStoreContext = createContext<ForwardingStoreValue | undefined>(undefined);

const DEFAULT_FORWARDING_NUMBER = '';

const SmsNativeModule = NativeModules.SmsForwardingModule as undefined | {
  getEventName?: () => Promise<string>;
  isDefaultSmsApp?: () => Promise<boolean>;
  openDefaultSmsPicker?: () => Promise<unknown>;
  sendForwardedMessage?: (address: string, body: string) => Promise<void>;
};

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function formatForwardedAt(value: Date | string | undefined) {
  if (!value) {
    return new Date().toLocaleString();
  }

  if (value instanceof Date) {
    return value.toLocaleString();
  }

  return value;
}

function formatForwardPayload(sender: string, body: string) {
  const header = sender.trim().length > 0 ? `From: ${sender}` : 'From: Unknown sender';
  const spacer = Platform.select({ ios: '\n\n', default: '\n\n' }) ?? '\n\n';

  return `${header}${spacer}${body}`;
}

export function ForwardingStoreProvider({ children }: { children: ReactNode }) {
  const [forwardingEnabled, setForwardingEnabled] = useState(true);
  const [forwardingNumber, setForwardingNumber] = useState(DEFAULT_FORWARDING_NUMBER);
  const [messageLog, setMessageLog] = useState<MessageLogItem[]>([]);
  const [blacklist, setBlacklist] = useState<BlockedEntry[]>([]);

  const toggleForwarding = useCallback((enabled: boolean) => {
    setForwardingEnabled(enabled);
  }, []);

  const updateForwardingNumber = useCallback((value: string) => {
    const next = value.trim();

    if (next.length === 0) {
      return;
    }

    setForwardingNumber(next);
  }, []);

  const recordForwardedMessage = useCallback((entry: {
    sender: string;
    preview: string;
    forwardedAt?: Date | string;
  }) => {
    setMessageLog((prev) => [{
      id: createId(),
      sender: entry.sender,
      preview: entry.preview,
      forwardedAt: formatForwardedAt(entry.forwardedAt),
    }, ...prev]);
  }, []);

  const addBlockedEntry = useCallback((label: string) => {
    const next = label.trim();

    if (next.length === 0) {
      return { success: false, reason: 'EMPTY' } as const;
    }

    let didInsert = false;

    setBlacklist((prev) => {
      const exists = prev.some((entry) => entry.label.toLowerCase() === next.toLowerCase());

      if (exists) {
        return prev;
      }

      didInsert = true;
      return [{ id: createId(), label: next }, ...prev];
    });

    if (!didInsert) {
      return { success: false, reason: 'DUPLICATE' } as const;
    }

    return { success: true } as const;
  }, []);

  const removeBlockedEntry = useCallback((id: string) => {
    setBlacklist((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const isSenderBlocked = useCallback((label: string) => {
    const normalized = label.trim().toLowerCase();

    return blacklist.some((item) => item.label.toLowerCase() === normalized);
  }, [blacklist]);

  const forwardIncomingMessage = useCallback(async ({ sender, body, receivedAt }: ForwardMessagePayload): Promise<ForwardMessageResult> => {
    if (!forwardingEnabled) {
      return { success: false, reason: 'DISABLED' };
    }

    if (!forwardingNumber) {
      return { success: false, reason: 'MISSING_FORWARD_NUMBER' };
    }

    if (isSenderBlocked(sender)) {
      return { success: false, reason: 'BLACKLISTED' };
    }

    try {
      if (Platform.OS === 'android' && SmsNativeModule?.sendForwardedMessage) {
        await SmsNativeModule.sendForwardedMessage(forwardingNumber, formatForwardPayload(sender, body));
        const preview = body.length > 160 ? `${body.slice(0, 157).trimEnd()}…` : body;
        recordForwardedMessage({ sender, preview, forwardedAt: receivedAt });
        return { success: true };
      }

      const canSend = await SMS.isAvailableAsync();

      if (!canSend) {
        return { success: false, reason: 'SMS_UNAVAILABLE' };
      }

      const result = await SMS.sendSMSAsync([forwardingNumber], formatForwardPayload(sender, body));
      const outcome = typeof result === 'string' ? result : result.result;

      if (outcome === 'sent' || outcome === 'queued') {
        const preview = body.length > 160 ? `${body.slice(0, 157).trimEnd()}…` : body;

        recordForwardedMessage({ sender, preview, forwardedAt: receivedAt });
        return { success: true };
      }

      if (outcome === 'cancelled') {
        return { success: false, reason: 'CANCELLED' };
      }

      return { success: false, reason: 'FAILED' };
    } catch (error) {
      return {
        success: false,
        reason: 'FAILED',
        error: error instanceof Error ? error : new Error('Failed to forward message'),
      };
    }
  }, [forwardingEnabled, forwardingNumber, isSenderBlocked, recordForwardedMessage]);

  useEffect(() => {
    if (Platform.OS !== 'android' || !SmsNativeModule) {
      return;
    }

    const requestPermissions = async () => {
      try {
        await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.RECEIVE_SMS ?? '',
          PermissionsAndroid.PERMISSIONS.READ_SMS ?? '',
          PermissionsAndroid.PERMISSIONS.SEND_SMS ?? '',
        ].filter(Boolean));
      } catch {
        // ignore permission request errors; user may reject
      }
    };

    requestPermissions();

    const emitter = new NativeEventEmitter(NativeModules.SmsForwardingModule);
    const subscription = emitter.addListener('SmsForwardingModule.onSmsReceived', (payload: { sender?: string; body?: string; timestamp?: number }) => {
      if (!payload?.body) {
        return;
      }

      const receivedAt = typeof payload.timestamp === 'number'
        ? new Date(payload.timestamp)
        : undefined;

      forwardIncomingMessage({
        sender: payload.sender ?? '',
        body: payload.body,
        receivedAt,
      }).catch(() => {
        // Swallow forwarding errors here; UI can reflect via logs elsewhere
      });
    });

    return () => {
      subscription.remove();
    };
  }, [forwardIncomingMessage]);

  const value = useMemo<ForwardingStoreValue>(() => ({
    forwardingEnabled,
    forwardingNumber,
    messageLog,
    blacklist,
    toggleForwarding,
    updateForwardingNumber,
    recordForwardedMessage,
    addBlockedEntry,
    removeBlockedEntry,
    isSenderBlocked,
    forwardIncomingMessage,
  }), [
    forwardingEnabled,
    forwardingNumber,
    messageLog,
    blacklist,
    toggleForwarding,
    updateForwardingNumber,
    recordForwardedMessage,
    addBlockedEntry,
    removeBlockedEntry,
    isSenderBlocked,
    forwardIncomingMessage,
  ]);

  return (
    <ForwardingStoreContext.Provider value={value}>
      {children}
    </ForwardingStoreContext.Provider>
  );
}

export function useForwardingStore() {
  const context = useContext(ForwardingStoreContext);

  if (!context) {
    throw new Error('useForwardingStore must be used within ForwardingStoreProvider');
  }

  return context;
}
