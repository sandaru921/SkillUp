import React from 'react';
import { NavigationContainer, DefaultTheme as NavigationDefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSelector } from 'react-redux';
import { Feather } from '@expo/vector-icons';
import Login from '../screens/Login';
import Register from '../screens/Register';
import Home from '../screens/Home';
import Details from '../screens/Details';
import Favorites from '../screens/Favorites';
import Profile from '../screens/Profile';
import { useTheme as usePaperTheme } from 'react-native-paper';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  const paperTheme = usePaperTheme();
  return (
    <Tab.Navigator screenOptions={{ tabBarActiveTintColor: paperTheme.colors.primary, tabBarStyle: { backgroundColor: paperTheme.colors.background } }}>
      <Tab.Screen name="Home" component={Home} options={{ tabBarIcon: ({ color }) => <Feather name="home" size={24} color={color} /> }} />
      <Tab.Screen name="Favorites" component={Favorites} options={{ tabBarIcon: ({ color }) => <Feather name="heart" size={24} color={color} /> }} />
      <Tab.Screen name="Profile" component={Profile} options={{ tabBarIcon: ({ color }) => <Feather name="user" size={24} color={color} /> }} />
    </Tab.Navigator>
  );
}

export default function Navigation({ isDarkMode }) {
  const { token, user } = useSelector(state => state.auth);
  const paperTheme = usePaperTheme();

  // Merge Navigation default theme with Paper theme colors
  const navigationTheme = {
    ...NavigationDefaultTheme,
    dark: isDarkMode,
    colors: {
      ...NavigationDefaultTheme.colors,
      primary: paperTheme.colors.primary,
      background: paperTheme.colors.background,
      card: paperTheme.colors.surface,
      text: paperTheme.colors.text,
      border: paperTheme.colors.placeholder,
      notification: paperTheme.colors.notification,
    },
  };

  return (
    <NavigationContainer theme={navigationTheme}>
      {token ? (
        <Stack.Navigator>
          <Stack.Screen name="Main" component={MainTabs} options={{ headerTitle: `Welcome, ${user?.email || 'User'}`, headerTintColor: paperTheme.colors.text, headerStyle: { backgroundColor: paperTheme.colors.background } }} />
          <Stack.Screen name="Details" component={Details} options={{ headerTintColor: paperTheme.colors.text, headerStyle: { backgroundColor: paperTheme.colors.background } }} />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator>
          <Stack.Screen name="Login" component={Login} options={{ headerTintColor: paperTheme.colors.text, headerStyle: { backgroundColor: paperTheme.colors.background } }} />
          <Stack.Screen name="Register" component={Register} options={{ headerTintColor: paperTheme.colors.text, headerStyle: { backgroundColor: paperTheme.colors.background } }} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}