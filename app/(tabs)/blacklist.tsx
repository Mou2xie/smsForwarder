import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useCallback, useState } from 'react';
import {
  Alert,
  FlatList,
  Modal,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { useForwardingStore, type BlockedEntry } from '../../hooks/useForwardingStore';

export default function BlacklistScreen() {
  const {
    blacklist,
    addBlockedEntry,
  } = useForwardingStore();
  const [isAdding, setIsAdding] = useState(false);
  const [draftLabel, setDraftLabel] = useState('');

  const openAddModal = useCallback(() => {
    setDraftLabel('');
    setIsAdding(true);
  }, []);

  const closeAddModal = useCallback(() => {
    setIsAdding(false);
    setDraftLabel('');
  }, []);

  const handleSubmit = useCallback(() => {
    const result = addBlockedEntry(draftLabel);

    if (!result.success) {
      if (result.reason === 'DUPLICATE') {
        Alert.alert('Already added', 'This sender is already on your blacklist.');
      } else {
        Alert.alert('Missing value', 'Enter the phone number or sender name to add.');
      }

      return;
    }

    closeAddModal();
  }, [addBlockedEntry, draftLabel, closeAddModal]);

  return (
    <View style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <View className=' h-[80] px-10 flex flex-row justify-between items-center'>
        <Text className=' font-semibold text-2xl'>Blocked senders</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={openAddModal}>
          <MaterialCommunityIcons name="plus" size={34} color="#324155" />
        </TouchableOpacity> 
      </View>
      <FlatList
        data={blacklist}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item }) => <BlacklistRow item={item} />}
        ListEmptyComponent={<Text style={styles.emptyCopy}>No blocked senders yet.</Text>}
      />
      <Modal
        animationType="fade"
        transparent
        visible={isAdding}
        onRequestClose={closeAddModal}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Add to blacklist</Text>
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              autoFocus
              placeholder="Phone number or sender name"
              placeholderTextColor="#94a3b8"
              value={draftLabel}
              onChangeText={setDraftLabel}
              style={styles.modalInput}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity onPress={closeAddModal} style={styles.modalSecondaryButton}>
                <Text style={styles.modalSecondaryLabel}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSubmit} style={styles.modalPrimaryButton}>
                <Text style={styles.modalPrimaryLabel}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function BlacklistRow({ item }: { item: BlockedEntry }) {
  const { removeBlockedEntry } = useForwardingStore();

  const confirmRemoval = useCallback(() => {
    Alert.alert('Remove sender', 'Are you sure you want to remove this sender from the blacklist?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => removeBlockedEntry(item.id),
      },
    ]);
  }, [item.id, removeBlockedEntry]);

  return (
    <View style={styles.row} className=' mx-8'>
      <View style={styles.rowCopy}>
        <Text style={styles.rowLabel}>{item.label}</Text>
      </View>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={confirmRemoval}>
        <MaterialCommunityIcons name="trash-can-outline" size={20} color="#f5f7fa" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#E3E9F0',
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 24,
    gap: 24,
  },
  heading: {
    fontSize: 20,
    fontWeight: '700',
    color: '#324155',
  },
  listContent: {
    gap: 16,
    paddingBottom: 40,
  },
  separator: {
    height: 0,
  },
  row: {
    backgroundColor: '#64748C',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  rowCopy: {
    flex: 1,
    gap: 4,
  },
  rowLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f5f7fa',
  },
  rowMeta: {
    fontSize: 13,
    color: '#9aa4b5',
  },
  removeButton: {
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: '#3c4d63',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyCopy: {
    textAlign: 'center',
    color: '#9aa4b5',
    fontSize: 14,
    paddingVertical: 32,
  },
  addButton: {
    flexDirection: 'row',
    gap: 10,
    borderRadius: 22,
    alignItems: 'center',
  },
  addButtonLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1f2939',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#f8fafc',
    borderRadius: 18,
    paddingVertical: 24,
    paddingHorizontal: 20,
    gap: 18,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2939',
  },
  modalInput: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#cbd5f5',
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1f2939',
    backgroundColor: '#ffffff',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  modalSecondaryButton: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: 'transparent',
  },
  modalSecondaryLabel: {
    fontSize: 16,
    color: '#475569',
  },
  modalPrimaryButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#3c4d63',
  },
  modalPrimaryLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f5f7fa',
  },
});
