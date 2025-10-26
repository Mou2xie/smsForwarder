import { Tabs } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 68,
          paddingVertical: 10,
          borderTopWidth: 0,
          backgroundColor: '#ebf0f6',
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginBottom: 6,
        },
        tabBarActiveTintColor: '#1f2939',
        tabBarInactiveTintColor: '#9aa4b5',
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
