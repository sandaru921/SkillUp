import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSlice';
import { View, Text, Switch } from 'react-native';
import { Button, useTheme } from 'react-native-paper';

export default function Profile() {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const theme = useTheme();
  const isDarkMode = theme.dark; // From paper theme

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: theme.colors.background }}>
      <Text style={{ fontSize: 20, color: theme.colors.text }}>Username: {user?.email || 'Guest'}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20 }}>
        <Text style={{ color: theme.colors.text }}>Dark Mode</Text>
        <Switch value={isDarkMode} onValueChange={global.toggleTheme} />
      </View>
      <Button mode="contained" onPress={() => dispatch(logout())} style={{ marginTop: 20 }}>Logout</Button>
    </View>
  );
}