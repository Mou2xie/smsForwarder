import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import {
  ScrollView,
  Text,
  View
} from 'react-native';

import { useForwardingStore, type MessageLogItem } from '../../hooks/useForwardingStore';

export default function MessageLogScreen() {
  const { messageLog } = useForwardingStore();

  return (
    <View className=' flex-1 bg-[#737F94]'>
      <View className=' h-[80] px-10 flex flex-row justify-between items-center'>
        <Text className=' text-white font-semibold text-2xl'>Message log</Text>
        <MaterialCommunityIcons name="magnify" size={34} color="#CCD5E2" />
      </View>
      <ScrollView className=' flex-grow bg-[#E3E9F0] rounded-t-[30] px-7 pt-5'>
        {messageLog.map((item) => (
          <ListItem key={item.id} item={item} />
        ))}
      </ScrollView>
    </View>
  );
}

type ListItemProps = {
  item: MessageLogItem;
};

const ListItem = ({ item }: ListItemProps) => {
  return (
    <View className=' flex flex-row justify-between items-center my-3'>
      <View className=' flex flex-col w-2/3'>
        <Text className=' text-[1.4rem] text-[#64748C] font-semibold'>{item.sender}</Text>
        <Text className=' text-[#64748C] line-clamp-1 text-sm'>{item.preview}</Text>
      </View>
      <Text className=' text-[#64748C] flex-shrink-0 text-sm'>{item.forwardedAt}</Text>
    </View>
  );
}
