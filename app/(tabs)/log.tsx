import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useMemo } from 'react';
import {
  ScrollView,
  Text,
  View
} from 'react-native';

type MessageLogItem = {
  id: string;
  sender: string;
  preview: string;
  forwardedAt: string;
};

const mockLog: MessageLogItem[] = [
  {
    id: '1',
    sender: '+1 555-1234',
    preview: 'Verification code 284953',
    forwardedAt: 'Today · 13:20',
  },
  {
    id: '2',
    sender: 'My Bank',
    preview: 'Your account was accessed from a new device.',
    forwardedAt: 'Today · 07:45',
  },
  {
    id: '3',
    sender: '+1 213-9876',
    preview: 'Package delivered at front door.',
    forwardedAt: 'Yesterday · 18:04',
  },
];

export default function MessageLogScreen() {
  const data = useMemo(() => mockLog, []);

  return (
    <View className=' flex-1 bg-[#737F94]'>
      <View className=' h-[80] px-10 flex flex-row justify-between items-center'>
        <Text className=' text-white font-semibold text-2xl'>Message log</Text>
        <MaterialCommunityIcons name="magnify" size={34} color="#CCD5E2" />
      </View>
      <ScrollView className=' flex-grow bg-[#E3E9F0] rounded-t-[30] px-5 pt-5'>
        {data.map((item) => (
          <ListItem key={item.id} item={item} />
        ))}
      </ScrollView>
    </View>
  );
}

type ListItemProps = {
  item: MessageLogItem;
};

const ListItem = ({item}:{item: MessageLogItem})=>{
  return (
    <View key={item.id} className=' mb-4 p-4 border border-gray-200 rounded-lg'>
      <Text className=' text-gray-800 font-medium'>{item.sender}</Text>
      <Text className=' text-gray-600 mt-1'>{item.preview}</Text>
      <Text className=' text-gray-400 mt-2 text-sm'>{item.forwardedAt}</Text>
    </View>
  );
}
