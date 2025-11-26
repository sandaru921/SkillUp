import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Card, Title, Paragraph, useTheme } from 'react-native-paper';
import { Feather } from '@expo/vector-icons';

const BookCard = ({ item, navigation }) => {
  const theme = useTheme();

  return (
    <TouchableOpacity onPress={() => navigation.navigate('Details', { item })}>
      <Card style={{ margin: 10, elevation: 4, backgroundColor: theme.colors.surface }}>
        <Card.Cover source={{ uri: `https://covers.openlibrary.org/b/id/${item.cover_i}-M.jpg` || 'https://placehold.it/100x150' }} />
        <Card.Content>
          <Title style={{ color: theme.colors.text }}>{item.title}</Title>
          <Paragraph style={{ color: theme.colors.text }}>{item.subject ? item.subject[0] : 'Popular'}</Paragraph>
          <Feather name="book" size={24} color={theme.colors.primary} />
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};

export default BookCard;