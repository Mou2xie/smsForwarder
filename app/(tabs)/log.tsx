import { useMemo } from 'react';
import {
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

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
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        <Text style={styles.heading}>Recent forwards</Text>
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({ item }) => <MessageLogRow item={item} />}
        />
      </View>
    </SafeAreaView>
  );
}

function MessageLogRow({ item }: { item: MessageLogItem }) {
  return (
    <View style={styles.logRow}>
      <View style={styles.iconCircle}>
        <MaterialCommunityIcons name="arrow-top-right" size={20} color="#3c4d63" />
      </View>
      <View style={styles.logCopy}>
        <Text style={styles.logSender}>{item.sender}</Text>
        <Text style={styles.logPreview} numberOfLines={1}>
          {item.preview}
        </Text>
      </View>
      <Text style={styles.logTimestamp}>{item.forwardedAt}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#dbe3ec',
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  heading: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2939',
    marginBottom: 16,
  },
  listContent: {
    paddingBottom: 40,
    gap: 16,
  },
  separator: {
    height: 0,
  },
  logRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f7fa',
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 16,
    gap: 16,
  },
  iconCircle: {
    height: 44,
    width: 44,
    borderRadius: 22,
    backgroundColor: '#e4eaf3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logCopy: {
    flex: 1,
    gap: 4,
  },
  logSender: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1f2939',
  },
  logPreview: {
    fontSize: 13,
    color: '#52607a',
  },
  logTimestamp: {
    fontSize: 12,
    color: '#7b869b',
  },
});
