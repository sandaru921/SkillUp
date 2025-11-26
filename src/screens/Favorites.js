import React from 'react';
import { useSelector } from 'react-redux';
import { View, FlatList, Text, Dimensions } from 'react-native';
import { useTheme } from 'react-native-paper';
import BookCard from '../components/BookCard';

export default function Favorites({ navigation }) {
  const favorites = useSelector(state => state.favorites.favorites);
  const theme = useTheme();

  const numColumns = Dimensions.get('window').width > 600 ? 2 : 1;

  return (
    <View style={{ flex: 1, padding: 10, backgroundColor: theme.colors.background }}>
      <FlatList
        data={favorites}
        renderItem={({ item }) => <BookCard item={item} navigation={navigation} />}
        keyExtractor={item => item.key}
        numColumns={numColumns}
        key={numColumns}
      />
      {favorites.length === 0 && <Text style={{ color: theme.colors.text }}>No favorites yet</Text>}
    </View>
  );
}