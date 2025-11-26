import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Fetch books with optional search query
export const fetchBooks = createAsyncThunk(
  'books/fetchBooks', 
  async (query = 'education', { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `https://openlibrary.org/search.json?q=${query}&limit=40&fields=key,title,author_name,cover_i,first_publish_year,subject,isbn,publisher`,
        {
          headers: { 'User-Agent': 'EducationApp/1.0 (contact@example.com)' },
        }
      );
      return res.data.docs;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Search books by specific query
export const searchBooks = createAsyncThunk(
  'books/searchBooks',
  async (searchTerm, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `https://openlibrary.org/search.json?q=${encodeURIComponent(searchTerm)}&limit=40&fields=key,title,author_name,cover_i,first_publish_year,subject,isbn,publisher`,
        {
          headers: { 'User-Agent': 'EducationApp/1.0 (contact@example.com)' },
        }
      );
      return res.data.docs;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Fetch detailed book information
export const fetchBookDetails = createAsyncThunk(
  'books/fetchBookDetails', 
  async (key, { rejectWithValue }) => {
    try {
      // Remove /works/ prefix if present
      const bookKey = key.replace('/works/', '');
      
      const res = await axios.get(
        `https://openlibrary.org/works/${bookKey}.json`,
        {
          headers: { 'User-Agent': 'EducationApp/1.0 (contact@example.com)' },
        }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const booksSlice = createSlice({
  name: 'books',
  initialState: { 
    books: [], 
    details: {}, 
    loading: false, 
    error: null,
    searchQuery: '',
  },
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearBookDetails: (state) => {
      state.details = {};
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Books
      .addCase(fetchBooks.pending, (state) => { 
        state.loading = true; 
        state.error = null; 
      })
      .addCase(fetchBooks.fulfilled, (state, action) => { 
        state.loading = false; 
        state.books = action.payload; 
      })
      .addCase(fetchBooks.rejected, (state, action) => { 
        state.loading = false; 
        state.error = action.payload; 
      })
      // Search Books
      .addCase(searchBooks.pending, (state) => { 
        state.loading = true; 
        state.error = null; 
      })
      .addCase(searchBooks.fulfilled, (state, action) => { 
        state.loading = false; 
        state.books = action.payload; 
      })
      .addCase(searchBooks.rejected, (state, action) => { 
        state.loading = false; 
        state.error = action.payload; 
      })
      // Fetch Book Details
      .addCase(fetchBookDetails.pending, (state) => { 
        state.loading = true; 
        state.error = null; 
      })
      .addCase(fetchBookDetails.fulfilled, (state, action) => { 
        state.loading = false; 
        state.details = action.payload; 
      })
      .addCase(fetchBookDetails.rejected, (state, action) => { 
        state.loading = false; 
        state.error = action.payload; 
      });
  },
});

export const { setSearchQuery, clearError, clearBookDetails } = booksSlice.actions;
export default booksSlice.reducer;