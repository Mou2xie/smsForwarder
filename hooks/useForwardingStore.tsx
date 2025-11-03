import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

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
};

const ForwardingStoreContext = createContext<ForwardingStoreValue | undefined>(undefined);

const initialLog: MessageLogItem[] = [
  {
    id: '1',
    sender: '+1 555-1234',
    preview: 'Verification code 284953',
    forwardedAt: 'Today 13:20',
  },
  {
    id: '2',
    sender: 'My Bank',
    preview: 'Your account was accessed from a new device.',
    forwardedAt: 'Today 07:45',
  },
  {
    id: '3',
    sender: '+1 213-9876',
    preview: 'Package delivered at front door.',
    forwardedAt: '10/22 18:04',
  },
];

const initialBlacklist: BlockedEntry[] = [
  { id: '1', label: '+1 555-222-0199' },
  { id: '2', label: 'Spam Service' },
];

const DEFAULT_FORWARDING_NUMBER = '+1 (382) 889 3727';

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

export function ForwardingStoreProvider({ children }: { children: ReactNode }) {
  const [forwardingEnabled, setForwardingEnabled] = useState(true);
  const [forwardingNumber, setForwardingNumber] = useState(DEFAULT_FORWARDING_NUMBER);
  const [messageLog, setMessageLog] = useState<MessageLogItem[]>(initialLog);
  const [blacklist, setBlacklist] = useState<BlockedEntry[]>(initialBlacklist);

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
