import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useCallback, useState } from 'react';
import {
  Alert,
  FlatList,
  Modal,
  StatusBar,
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
    <View className='flex-1 bg-[#E3E9F0]'>
      <StatusBar barStyle="light-content" />
      <View className='h-[80] px-10 flex flex-row justify-between items-center'>
        <Text className='font-semibold text-2xl'>Blocked senders</Text>
        <TouchableOpacity
          className='flex-row gap-[10px] rounded-[22px] items-center'
          onPress={openAddModal}>
          <MaterialCommunityIcons name="plus" size={34} color="#324155" />
        </TouchableOpacity> 
      </View>
      <FlatList
        data={blacklist}
        keyExtractor={(item) => item.id}
        contentContainerClassName='gap-4 pb-10'
        ItemSeparatorComponent={() => <View className='h-0' />}
        renderItem={({ item }) => <BlacklistRow item={item} />}
        ListEmptyComponent={<Text className='text-center text-[#9aa4b5] text-sm py-8'>No blocked senders yet.</Text>}
      />
      <Modal
        animationType="fade"
        transparent
        visible={isAdding}
        onRequestClose={closeAddModal}>
        <View className='flex-1 bg-[rgba(15,23,42,0.65)] items-center justify-center px-6'>
          <View className='w-full max-w-[360px] bg-[#f8fafc] rounded-[18px] py-6 px-5 gap-[18px]'>
            <Text className='text-[20px] font-semibold text-[#1f2939]'>Add to blacklist</Text>
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              autoFocus
              placeholder="Phone number or sender name"
              placeholderTextColor="#94a3b8"
              value={draftLabel}
              onChangeText={setDraftLabel}
              className='rounded-[12px] border border-[#cbd5f5] px-4 py-3 text-[16px] text-[#1f2939] bg-white'
            />
            <View className='flex-row justify-end gap-3'>
              <TouchableOpacity onPress={closeAddModal} className='px-[18px] py-3 rounded-[12px]'>
                <Text className='text-[16px] text-[#475569]'>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSubmit} className='px-5 py-3 rounded-[12px] bg-[#3c4d63]'>
                <Text className='text-[16px] font-semibold text-[#f5f7fa]'>Add</Text>
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
    <View className='mx-8 bg-[#64748C] rounded-[16px] px-5 py-[18px] flex-row items-center gap-4'>
      <View className='flex-1 gap-1'>
        <Text className='text-[16px] font-semibold text-[#f5f7fa]'>{item.label}</Text>
      </View>
      <TouchableOpacity
        className='h-10 w-10 rounded-full bg-[#3c4d63] items-center justify-center'
        onPress={confirmRemoval}>
        <MaterialCommunityIcons name="trash-can-outline" size={20} color="#f5f7fa" />
      </TouchableOpacity>
    </View>
  );
}
