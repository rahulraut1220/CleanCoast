// features/userSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isLoading: false
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
      state.isLoading = false;
    },
    logoutUser(state) {
      state.user = null;
      state.isLoading = false; // ✅ important!
    },
    setLoading(state) {
      state.isLoading = true;
    }
  }
});

export const { setUser, logoutUser, setLoading } = userSlice.actions;
export default userSlice.reducer;
