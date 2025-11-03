import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';
import { useCallback, useState, type ReactNode } from 'react';
import {
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  View,
} from 'react-native';

import { useForwardingStore } from '../../hooks/useForwardingStore';

export default function MainScreen() {
  const router = useRouter();
  const {
    forwardingEnabled,
    forwardingNumber,
    messageLog,
    blacklist,
    toggleForwarding,
    updateForwardingNumber,
  } = useForwardingStore();
  const [isEditingNumber, setIsEditingNumber] = useState(false);
  const [draftNumber, setDraftNumber] = useState(forwardingNumber);

  const messageCount = messageLog.length;
  const blacklistCount = blacklist.length;

  const openEditor = useCallback(() => {
    setDraftNumber(forwardingNumber);
    setIsEditingNumber(true);
  }, [forwardingNumber]);

  const closeEditor = useCallback(() => {
    setIsEditingNumber(false);
  }, []);

  const submitNumber = useCallback(() => {
    const trimmed = draftNumber.trim();

    if (!trimmed) {
      return;
    }

    updateForwardingNumber(trimmed);
    closeEditor();
  }, [draftNumber, updateForwardingNumber, closeEditor]);

  return (
    <View className='flex-1 bg-[#dbe3ec]'>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerClassName='px-6 pt-8 pb-10 gap-6'
        showsVerticalScrollIndicator={false}>
        <View className='px-10'>
          <Switch
            style={{ transform: [{ scaleX: 1.3 }, { scaleY: 1.3 }] }}
            trackColor={{ false: '#9aa4b5', true: '#4c5b73' }}
            thumbColor={forwardingEnabled ? '#ffffff' : '#f2f4f8'}
            value={forwardingEnabled}
            onValueChange={toggleForwarding}
          />
        </View>

        <View className='gap-[15px]'>
          <View className='h-[180] bg-[#3c4d63] rounded-[18px] p-6 relative overflow-hidden'>
            <View className='absolute w-[230px] h-[230px] rounded-[125px] bg-[rgba(255,255,255,0.06)] top-[-50px] left-[-70px]' />
            <View className='absolute w-[160px] h-[160px] rounded-[80px] bg-[rgba(255,255,255,0.04)] top-[-50px] left-[-20px]' />
            <Ionicons name="paper-plane-outline" size={30} color="#64748C" />
            <View className='flex-1'></View>
            <Text className='text-[18px] text-[#d0d9e6]'>Forwarding to</Text>
            <Text className='mt-[2px] text-[26px] font-bold text-[#f5f7fa]'>{forwardingNumber}</Text>

            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Change forwarding number"
              onPress={() => {
                openEditor();
              }}
              className='absolute top-4 right-4 h-9 w-9 rounded-full bg-[rgba(255,255,255,0.08)] items-center justify-center'>
              <MaterialCommunityIcons name="pencil-outline" size={22} color="#c8d1e0" />
            </TouchableOpacity>
          </View>

          <View className='gap-[15px]'>
            <HomeStatCard
              icon={<MaterialCommunityIcons name="arrow-top-right" size={30} color="#d5deec" />}
              label="Message log"
              value={messageCount}
              backgroundColor="#64728a"
              accentCircleColor="rgba(255,255,255,0.12)"
              onPress={() => router.push('/log')}
            />
            <HomeStatCard
              icon={<MaterialCommunityIcons name="minus-circle-outline" size={30} color="#d5deec" />}
              label="Black list"
              value={blacklistCount}
              backgroundColor="#1f2939"
              accentCircleColor="rgba(100,114,138,0.35)"
              onPress={() => router.push('/blacklist')}
            />
          </View>
        </View>
      </ScrollView>
      <Modal
        animationType="fade"
        transparent
        visible={isEditingNumber}
        onRequestClose={closeEditor}>
        <View className='flex-1 bg-[rgba(15,23,42,0.65)] items-center justify-center px-6'>
          <View className='w-full max-w-[360px] bg-[#f8fafc] rounded-[18px] py-6 px-5 gap-[18px]'>
            <Text className='text-[20px] font-semibold text-[#1f2939] text-left'>Update forwarding number</Text>
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              autoFocus
              keyboardType="phone-pad"
              placeholder="Enter number"
              placeholderTextColor="#94a3b8"
              value={draftNumber}
              onChangeText={setDraftNumber}
              className='rounded-[12px] border border-[#cbd5f5] px-4 py-3 text-[16px] text-[#1f2939] bg-white'
            />
            <View className='flex-row justify-end gap-3'>
              <TouchableOpacity onPress={closeEditor} className='px-[18px] py-3 rounded-[12px]'>
                <Text className='text-[16px] text-[#475569]'>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={submitNumber} className='px-5 py-3 rounded-[12px] bg-[#3c4d63]'>
                <Text className='text-[16px] font-semibold text-[#f5f7fa]'>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

type HomeStatCardProps = {
  icon: ReactNode;
  label: string;
  value: number;
  backgroundColor: string;
  accentCircleColor: string;
  onPress: () => void;
};

function HomeStatCard({
  icon,
  label,
  value,
  backgroundColor,
  accentCircleColor,
  onPress,
}: HomeStatCardProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      className='rounded-[16px] py-[14px] px-5 overflow-hidden'
      style={{ backgroundColor }}>
      <View
        className='absolute w-[110px] h-[110px] rounded-[80px] top-[-30px] right-[-40px]'
        style={{ backgroundColor: accentCircleColor }}
      />
      <View className='flex-row items-center justify-between'>
        <View className='flex flex-col gap-[5px]'>
          <View>{icon}</View>
          <Text className='text-[18px] text-[#d0d9e6]'>{label}</Text>
        </View>
        <Text className='self-end text-[22px] text-[#f5f7fa]'>{value}</Text>
      </View>
    </TouchableOpacity>
  );
}
