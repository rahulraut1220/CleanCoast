// src/redux/slices/organizerSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';

// Async Thunk: Fetch Events Created by Organizer
export const fetchOrganizerEvents = createAsyncThunk(
  'organizer/fetchEvents',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get('/events', { withCredentials: true });
      return res.data;
    } catch (err) {
      toast.error('❌ Failed to load events');
      return rejectWithValue(err.response?.data || 'Server error');
    }
  }
);

const organizerSlice = createSlice({
  name: 'organizer',
  initialState: {
    events: [],
    loading: false,
    error: null
  },
  reducers: {
    clearOrganizerData: (state) => {
      state.events = [];
      state.loading = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrganizerEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrganizerEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload;
      })
      .addCase(fetchOrganizerEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch events';
      });
  }
});

export const { clearOrganizerData } = organizerSlice.actions;
export default organizerSlice.reducer;
