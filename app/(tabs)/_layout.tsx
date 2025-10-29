import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home-outline" size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="log"
        options={{
          title: 'Message log',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="arrow-top-right" size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="blacklist"
        options={{
          title: 'Black list',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="minus-circle-outline" size={22} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
