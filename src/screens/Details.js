import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBookDetails } from '../store/booksSlice';
import { addFavorite, removeFavorite } from '../store/favoritesSlice';
import { View, Text, Image, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { Button, useTheme } from 'react-native-paper';
import { Feather } from '@expo/vector-icons';

export default function Details({ route }) {
  const { item } = route.params;
  const dispatch = useDispatch();
  const { details, loading, error } = useSelector(state => state.books);
  const favorites = useSelector(state => state.favorites.favorites);
  const isFavorite = favorites.some(f => f.key === item.key);
  const theme = useTheme();

  useEffect(() => {
    dispatch(fetchBookDetails(item.key.replace('/works/', ''))); // Clean key
  }, [dispatch, item.key]);

  useEffect(() => {
    if (error) Alert.alert('Error', error);
  }, [error]);

  return (
    <ScrollView style={{ flex: 1, padding: 20, backgroundColor: theme.colors.background }}>
      {loading ? (
        <ActivityIndicator size="large" color={theme.colors.primary} />
      ) : (
        <>
          <Image source={{ uri: `https://covers.openlibrary.org/b/id/${item.cover_i}-L.jpg` || 'https://placehold.it/200x300' }} style={{ width: '100%', height: 300, resizeMode: 'contain' }} />
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: theme.colors.text, marginVertical: 10 }}>{item.title}</Text>
          <Text style={{ color: theme.colors.text }}>{details.description?.value || 'No description available'}</Text>
          <Text style={{ color: theme.colors.text, marginTop: 10 }}>Status: {item.subject ? item.subject[0] : 'Popular'}</Text>
          <Button icon={() => <Feather name="heart" size={24} color="white" />} mode="contained" onPress={() => isFavorite ? dispatch(removeFavorite(item.key)) : dispatch(addFavorite(item))} style={{ marginTop: 20 }}>
            {isFavorite ? 'Remove Favorite' : 'Add Favorite'}
          </Button>
        </>
      )}
    </ScrollView>
  );
}