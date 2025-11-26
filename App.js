import React, { useEffect, useState } from 'react';
import { Provider as PaperProvider, DefaultTheme, DarkTheme } from 'react-native-paper';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from './src/store/index';
import Navigation from './src/navigation/index';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance } from 'react-native';

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const loadTheme = async () => {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme) {
        setIsDarkMode(savedTheme === 'dark');
      } else {
        // Default to system theme
        const systemTheme = Appearance.getColorScheme();
        setIsDarkMode(systemTheme === 'dark');
      }
    };
    loadTheme();

    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      const savedTheme = AsyncStorage.getItem('theme'); // If manual, ignore system change
      if (!savedTheme) {
        setIsDarkMode(colorScheme === 'dark');
      }
    });
    return () => subscription.remove();
  }, []);

  const toggleTheme = async () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    await AsyncStorage.setItem('theme', newMode ? 'dark' : 'light');
  };

  // Provide toggle to children via context or props, but for simplicity, pass to Profile via global (or use context)
  global.toggleTheme = toggleTheme; // Global for simplicity, better use context in production

  const theme = isDarkMode ? DarkTheme : DefaultTheme;

  useEffect(() => {
    const loadData = async () => {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        store.dispatch({ type: 'auth/setUser', payload: { user: { email: await AsyncStorage.getItem('email') }, token } }); // Simple, restore user
      }
      const favs = await AsyncStorage.getItem('favorites');
      if (favs) {
        store.dispatch({ type: 'favorites/loadFavorites', payload: JSON.parse(favs) });
      }
    };
    loadData();
  }, []);

  return (
    <ReduxProvider store={store}>
      <PaperProvider theme={theme}>
        <Navigation isDarkMode={isDarkMode} />
      </PaperProvider>
    </ReduxProvider>
  );
}