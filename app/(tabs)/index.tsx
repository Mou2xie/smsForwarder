import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';
import { useState, type ReactNode } from 'react';
import {
  ScrollView,
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

  return (
    <View style={styles.safeArea}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}>
        <View className=' px-10'>
          <Switch
            style={{ transform: [{ scaleX: 1.3 }, { scaleY: 1.3 }] }}
            trackColor={{ false: '#9aa4b5', true: '#4c5b73' }}
            thumbColor={forwardingEnabled ? '#ffffff' : '#f2f4f8'}
            value={forwardingEnabled}
            onValueChange={setForwardingEnabled}
          />
        </View>

        <View style={styles.cardStack}>
          <View style={styles.forwardingCard} className=' h-[180]'>
            <View style={styles.cardDecorCircleLarge} />
            <View style={styles.cardDecorCircleSmall} />
            <Ionicons name="paper-plane-outline" size={30} color="#64748C" />
            <View className=' flex-1'></View>
            <Text style={styles.forwardingLabel}>Forwarding to</Text>
            <Text style={styles.forwardingNumber}>{forwardingNumber}</Text>

            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Change forwarding number"
              onPress={() => {
                // TODO: hook up to edit flow
              }}
              style={styles.editButton}>
              <MaterialCommunityIcons name="pencil-outline" size={22} color="#c8d1e0" />
            </TouchableOpacity>
          </View>

          <View style={styles.inlineCards}>
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
          <View>{icon}</View>
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
  statusLabel: {
    fontSize: 16,
    color: '#394867',
    fontWeight: '500',
  },
  cardStack: {
    gap: 15,
  },
  forwardingCard: {
    backgroundColor: '#3c4d63',
    borderRadius: 18,
    padding: 24,
    position: 'relative',
    overflow: 'hidden',
  },
  forwardingLabel: {
    fontSize: 18,
    color: '#d0d9e6',
  },
  forwardingNumber: {
    marginTop: 2,
    fontSize: 26,
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
    width: 230,
    height: 230,
    borderRadius: 125,
    backgroundColor: 'rgba(255,255,255,0.06)',
    top: -50,
    left: -70,
  },
  cardDecorCircleSmall: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.04)',
    top: -50,
    left: -20,
  },
  inlineCards: {
    gap: 15,
  },
  statCard: {
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 20,
    overflow: 'hidden',
  },
  statCardAccent: {
    position: 'absolute',
    width: 110,
    height: 110,
    borderRadius: 80,
    top: -30,
    right: -40,
  },
  statCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statCardLabelRow: {
    flexDirection: 'column',
    gap: 5,
  },
  statCardLabel: {
    fontSize: 18,
    color: '#d0d9e6',
  },
  statCardValue: {
    alignSelf: 'flex-end',
    fontSize: 22,
    color: '#f5f7fa',
  },
});
