import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ForwardingStoreProvider } from '../hooks/useForwardingStore';
import './global.css';

export default function RootLayout() {
  return (
    <ForwardingStoreProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <Stack screenOptions={{
          headerShown: false,
        }} />
      </SafeAreaView>
    </ForwardingStoreProvider>
  );
}
