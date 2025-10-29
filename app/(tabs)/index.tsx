import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';
import { useMemo, useState, type ReactNode } from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const forwardingNumber = '+1 (382) 889 3727';
const messageCount = 123;
const blacklistCount = 2;

export default function MainScreen() {
  
  const [forwardingEnabled, setForwardingEnabled] = useState(true);
  const router = useRouter();

  const forwardingStatusLabel = useMemo(
    () => (forwardingEnabled ? 'Forwarding enabled' : 'Forwarding paused'),
    [forwardingEnabled],
  );

  return (
    <View style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}>
        <View style={styles.toggleRow}>
          <Text style={styles.statusLabel}>{forwardingStatusLabel}</Text>
          <Switch
            trackColor={{ false: '#9aa4b5', true: '#4c5b73' }}
            thumbColor={forwardingEnabled ? '#ffffff' : '#f2f4f8'}
            value={forwardingEnabled}
            onValueChange={setForwardingEnabled}
            className=' h-10 border'
          />
        </View>

        <View style={styles.cardStack}>
          <View style={styles.forwardingCard}>
            <View style={styles.cardDecorCircleLarge} />
            <View style={styles.cardDecorCircleSmall} />
            <Ionicons name="paper-plane-outline" size={28} color="#c8d1e0" />
            <Text style={styles.forwardingLabel}>Forwarding to</Text>
            <Text style={styles.forwardingNumber}>{forwardingNumber}</Text>

            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Change forwarding number"
              onPress={() => {
                // TODO: hook up to edit flow
              }}
              style={styles.editButton}>
              <MaterialCommunityIcons name="pencil-outline" size={20} color="#c8d1e0" />
            </TouchableOpacity>
          </View>

          <View style={styles.inlineCards}>
            <HomeStatCard
              icon={<MaterialCommunityIcons name="arrow-top-right" size={20} color="#d5deec" />}
              label="Message log"
              value={messageCount}
              backgroundColor="#64728a"
              accentCircleColor="rgba(255,255,255,0.12)"
              onPress={() => router.push('/(tabs)/log')}
            />
            <HomeStatCard
              icon={<MaterialCommunityIcons name="minus-circle-outline" size={20} color="#d5deec" />}
              label="Black list"
              value={blacklistCount}
              backgroundColor="#1f2939"
              accentCircleColor="rgba(100,114,138,0.35)"
              onPress={() => router.push('/(tabs)/blacklist')}
            />
          </View>
        </View>
      </ScrollView>
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
      style={[styles.statCard, { backgroundColor }]}>
      <View style={[styles.statCardAccent, { backgroundColor: accentCircleColor }]} />
      <View style={styles.statCardContent}>
        <View style={styles.statCardLabelRow}>
          <View style={styles.statCardIcon}>{icon}</View>
          <Text style={styles.statCardLabel}>{label}</Text>
        </View>
        <Text style={styles.statCardValue}>{value}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#dbe3ec',
  },
  container: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
    gap: 24,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusLabel: {
    fontSize: 16,
    color: '#394867',
    fontWeight: '500',
  },
  cardStack: {
    gap: 16,
  },
  forwardingCard: {
    backgroundColor: '#3c4d63',
    borderRadius: 18,
    padding: 24,
    position: 'relative',
    overflow: 'hidden',
  },
  forwardingLabel: {
    marginTop: 24,
    fontSize: 16,
    color: '#d0d9e6',
  },
  forwardingNumber: {
    marginTop: 8,
    fontSize: 24,
    fontWeight: '700',
    color: '#f5f7fa',
  },
  editButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    height: 36,
    width: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardDecorCircleLarge: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(255,255,255,0.06)',
    top: -50,
    left: -60,
  },
  cardDecorCircleSmall: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.04)',
    top: -20,
    left: 40,
  },
  inlineCards: {
    gap: 12,
  },
  statCard: {
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 20,
    overflow: 'hidden',
  },
  statCardAccent: {
    position: 'absolute',
    width: 96,
    height: 96,
    borderRadius: 48,
    top: -28,
    right: -24,
  },
  statCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statCardLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statCardIcon: {
    height: 36,
    width: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statCardLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#e2e7f1',
  },
  statCardValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#f5f7fa',
  },
});
