import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs screenOptions={({ route }) => ({
      headerShown: false,
      tabBarActiveTintColor: '#1f2939',
      tabBarInactiveTintColor: '#94a3b8',
      tabBarStyle: {
        backgroundColor: '#E3E9F0',
        borderTopColor: '#cbd5f5',
        height: 66,
        paddingBottom: 10,
        paddingTop: 10,
      },
      tabBarIcon: ({ color, size }) => {
        if (route.name === 'index') {
          return <Ionicons name="home-outline" size={size} color={color} />;
        }

        if (route.name === 'log') {
          return <MaterialCommunityIcons name="arrow-top-right" size={size} color={color} />;
        }

        return <MaterialCommunityIcons name="minus-circle-outline" size={size} color={color} />;
      },
    })}>
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="log" options={{ title: 'Log' }} />
      <Tabs.Screen name="blacklist" options={{ title: 'Blacklist' }} />
    </Tabs>
  );
}
