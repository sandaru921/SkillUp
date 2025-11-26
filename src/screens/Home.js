import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBooks } from '../store/booksSlice';
import { View, FlatList, Text, ActivityIndicator, StyleSheet, Dimensions, RefreshControl } from 'react-native';
import { useTheme, Searchbar, Chip, FAB, Snackbar, Appbar, IconButton } from 'react-native-paper';
import BookCard from '../components/BookCard';

const { width } = Dimensions.get('window');
const isLargeScreen = width > 768;
const isTablet = width > 600;

export default function Home({ navigation, isDarkMode, toggleTheme }) {
  const dispatch = useDispatch();
  const { books, loading, error } = useSelector(state => state.books);
  const { user } = useSelector(state => state.auth);
  const theme = useTheme();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [refreshing, setRefreshing] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  useEffect(() => {
    dispatch(fetchBooks());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      setSnackbarVisible(true);
    }
  }, [error]);

  const onRefresh = async () => {
    setRefreshing(true);
    await dispatch(fetchBooks());
    setRefreshing(false);
  };

  // Filter books based on search query and category
  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.author_name?.[0]?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || 
                           book.subject?.includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  const categories = ['All', 'Fiction', 'Science', 'History', 'Biography', 'Fantasy'];

  const numColumns = isLargeScreen ? 3 : isTablet ? 2 : 1;

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      {/* Top Bar with Welcome and Theme Toggle */}
      <View style={styles.topBar}>
        <View style={styles.welcomeContainer}>
          <Text style={[styles.welcomeText, { color: theme.colors.onSurfaceVariant }]}>
            Welcome back,
          </Text>
          <Text style={[styles.userName, { color: theme.colors.onSurface }]}>
            {user?.username || user?.email?.split('@')[0] || 'Guest'} 👋
          </Text>
        </View>
        <IconButton
          icon={isDarkMode ? 'white-balance-sunny' : 'moon-waning-crescent'}
          size={24}
          onPress={toggleTheme}
          iconColor={theme.colors.primary}
          style={styles.themeToggle}
        />
      </View>

      {/* Main Title */}
      <Text style={[styles.headerTitle, { color: theme.colors.primary }]}>
        Your Library 📚
      </Text>
      <Text style={[styles.headerSubtitle, { color: theme.colors.onSurfaceVariant }]}>
        {filteredBooks.length} {filteredBooks.length === 1 ? 'book' : 'books'} available
      </Text>

      {/* Search Bar */}
      <Searchbar
        placeholder="Search books or authors..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={[styles.searchBar, { backgroundColor: theme.colors.surfaceVariant }]}
        iconColor={theme.colors.primary}
        elevation={0}
      />

      {/* Category Chips */}
      <View style={styles.categoriesContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={categories}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <Chip
              selected={selectedCategory === item}
              onPress={() => setSelectedCategory(item)}
              style={[
                styles.categoryChip,
                selectedCategory === item && { backgroundColor: theme.colors.primaryContainer }
              ]}
              textStyle={{
                color: selectedCategory === item 
                  ? theme.colors.onPrimaryContainer 
                  : theme.colors.onSurfaceVariant
              }}
              mode={selectedCategory === item ? 'flat' : 'outlined'}
            >
              {item}
            </Chip>
          )}
        />
      </View>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={[styles.emptyIcon, { color: theme.colors.onSurfaceVariant }]}>📚</Text>
      <Text style={[styles.emptyTitle, { color: theme.colors.onSurface }]}>
        No Books Found
      </Text>
      <Text style={[styles.emptySubtitle, { color: theme.colors.onSurfaceVariant }]}>
        {searchQuery ? 'Try adjusting your search' : 'Pull down to refresh'}
      </Text>
    </View>
  );

  const renderFooter = () => {
    if (!loading || books.length > 0) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={theme.colors.primary} />
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {loading && books.length === 0 ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.loadingText, { color: theme.colors.onSurfaceVariant }]}>
            Loading amazing books...
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredBooks}
          renderItem={({ item }) => (
            <View style={[
              styles.cardWrapper,
              { width: numColumns === 1 ? '100%' : numColumns === 2 ? '50%' : '33.33%' }
            ]}>
              <BookCard item={item} navigation={navigation} />
            </View>
          )}
          keyExtractor={item => item.key}
          numColumns={numColumns}
          key={numColumns}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={renderEmpty}
          ListFooterComponent={renderFooter}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[theme.colors.primary]}
              tint={theme.colors.primary}
            />
          }
        />
      )}

      <FAB
        icon="refresh"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={onRefresh}
        color={theme.colors.onPrimary}
        label="Refresh"
      />

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        action={{
          label: 'Retry',
          onPress: () => dispatch(fetchBooks()),
        }}
      >
        {error || 'Something went wrong'}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    padding: 16,
    paddingTop: 12,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  welcomeContainer: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 14,
    marginBottom: 2,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  themeToggle: {
    margin: 0,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    marginBottom: 16,
  },
  searchBar: {
    marginBottom: 16,
    borderRadius: 12,
  },
  categoriesContainer: {
    marginBottom: 8,
  },
  categoryChip: {
    marginRight: 8,
    borderRadius: 20,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: 80,
  },
  cardWrapper: {
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    borderRadius: 16,
  },
});