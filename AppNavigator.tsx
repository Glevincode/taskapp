import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Import Screens
import LandingPage from './android/components/LandingPage';
import TaskItems from './android/components/TaskItems';

const Tab = createBottomTabNavigator();

function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'LandingPage') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'TaskItems') {
              iconName = focused ? 'calendar' : 'calendar-outline';
            }

            // Return the appropriate icon
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#6C63FF',
          tabBarInactiveTintColor: '#333333',
          headerShown: false, // Hide the header for a cleaner look
        })}
      >
        <Tab.Screen name="LandingPage" component={LandingPage} />
        <Tab.Screen name="TaskItems" component={TaskItems} />
        
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;