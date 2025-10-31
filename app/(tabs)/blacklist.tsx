import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useMemo } from 'react';
import {
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type BlockedEntry = {
  id: string;
  label: string;
  addedAt: string;
};

const mockBlacklist: BlockedEntry[] = [
  { id: '1', label: '+1 555-222-0199', addedAt: 'Added · 2025-10-21' },
  { id: '2', label: 'Spam Service', addedAt: 'Added · 2025-09-11' },
];

export default function BlacklistScreen() {
  const data = useMemo(() => mockBlacklist, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        <Text style={styles.heading}>Blocked senders</Text>
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({ item }) => <BlacklistRow item={item} />}
          ListEmptyComponent={<Text style={styles.emptyCopy}>No blocked senders yet.</Text>}
        />

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            // TODO: present add-to-blacklist flow
          }}>
          <MaterialCommunityIcons name="plus" size={22} color="#1f2939" />
          <Text style={styles.addButtonLabel}>Add sender</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function BlacklistRow({ item }: { item: BlockedEntry }) {
  return (
    <View style={styles.row}>
      <View style={styles.rowCopy}>
        <Text style={styles.rowLabel}>{item.label}</Text>
        <Text style={styles.rowMeta}>{item.addedAt}</Text>
      </View>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => {
          // TODO: implement removal handler
        }}>
        <MaterialCommunityIcons name="trash-can-outline" size={20} color="#f5f7fa" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1f2939',
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
    color: '#f5f7fa',
  },
  listContent: {
    gap: 16,
    paddingBottom: 40,
  },
  separator: {
    height: 0,
  },
  row: {
    backgroundColor: '#273247',
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
    backgroundColor: '#f5f7fa',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  addButtonLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1f2939',
  },
});
