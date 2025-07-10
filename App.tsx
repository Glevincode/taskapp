import React from 'react';
import { useEffect } from 'react';
import { Settings, TouchableOpacity, View, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { LanguageProvider } from './android/components/LanguageContext';

import { SafeAreaView } from 'react-native-safe-area-context';
import { NotificationProvider } from './android/components/NotificationContext';
import { ThemeProvider } from './android/components/ThemeContext';
import { useTheme } from './android/components/ThemeContext';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import { Provider as PaperProvider } from 'react-native-paper';




// Screens
import Started from './android/components/Started';
import LandingPage from './android/components/LandingPage';
import TaskItems from './android/components/TaskItems';
import Profile from './android/components/Profile';
import AddTask from './android/components/AddTask';
import Chart from './android/components/Chart';
import CategoriesScreen from './android/components/CategoriesScreen';
import SearchScreen from './android/components/SearchScreen';

import { requestUserPermission, notificationListener } from './android/components/firebaseNotifications';
import Bellnotification from './android/components/Bellnotification';


const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();



// Bottom Tab Navigator
function TabNavigator() {
  const { darkMode } = useTheme();

  useEffect(() => {
    requestUserPermission();
    notificationListener();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: darkMode ? '#0f172a' : '#F5F7FA' }}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused }) => {
            let iconElement = null;
            const iconColor = focused ? '#f87171' : darkMode ? '#ccc' : 'black';

            if (route.name === 'LandingPage') {
              const iconName = focused ? 'home' : 'home-outline';
              iconElement = <Ionicons name={iconName} size={30} color={iconColor} />;
            } else if (route.name === 'Chart') {
              const iconName = focused ? 'stats-chart' : 'stats-chart-outline';
              iconElement = <Ionicons name={iconName} size={30} color={iconColor} />;
            } else if (route.name === 'AddTask') {
              iconElement = (
                <View style={{
                  backgroundColor: darkMode ? '#dc2626' : '#f87171' ,
                  width: 70,
                  height: 70,
                  borderRadius: 50,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: -40,
                  zIndex: 10,
                }}>
                  <FontAwesome5 name="plus" size={28} color="white" />
                </View>
              );
            } else if (route.name === 'TaskItems') {
              const iconName = focused ? 'calendar-clear' : 'calendar-clear-outline';
              iconElement = <Ionicons name={iconName} size={30} color={iconColor} />;
            } else if (route.name === 'Profile') {
              const iconName = focused ? 'person' : 'person-outline';
              iconElement = <Ionicons name={iconName} size={30} color={iconColor} />;
            }

            return iconElement;
          },
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            position: 'absolute',
            backgroundColor: darkMode ? '#1f2937' : '#FFFFFF',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            height: 70,
            paddingBottom: 30,
            paddingTop: 20,
            borderColor: darkMode ? '#374151' : '#E0E0E0',
            borderWidth: 1,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
          },
        })}
      >
        <Tab.Screen name="LandingPage" component={LandingPage} />
        <Tab.Screen name="TaskItems" component={TaskItems} />
        <Tab.Screen name="AddTask" component={AddTask} />
        <Tab.Screen name="Chart" component={Chart} />
        <Tab.Screen name="Profile" component={Profile} />
      
      </Tab.Navigator>
    </SafeAreaView>
  );
}
// App Entry
const MyStack = () => {
  const { darkMode } = useTheme();

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Started">

        <Stack.Screen
          name="Started"
          component={Started}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="LandingPage"
          component={TabNavigator}
          options={{ headerShown: false }}
        />

        <Stack.Screen name="AddTask" component={AddTask} />
        <Stack.Screen name="Chart" component={Chart} />
         <Stack.Screen 
          name="SearchScreen"
          component={SearchScreen}
           options={{ headerShown: false}}
          
          />

        <Stack.Screen
          name="CategoriesScreen"
          component={CategoriesScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Bellnotification"
          component={Bellnotification}
          
          options={{
            headerShown: false,
            headerStyle: { backgroundColor: darkMode ? '#1f2937' : '#fff' },
            headerTintColor: darkMode ? '#fff' : '#333',
          }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

// ✅ App component just returns the stack wrapped in providers
export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <NotificationProvider>
          <PaperProvider>
            <MyStack />
          </PaperProvider>
        </NotificationProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}