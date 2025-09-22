import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/userSlice'; // for later
import organizerReducer from '../features/organizerSlice'; // for organizer events

const store = configureStore({
  reducer: {
    user: userReducer,
    organizer: organizerReducer,
  },
});

export default store;
