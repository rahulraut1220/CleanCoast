import axios from './axiosInstance';

// ✅ Get current user
export const fetchCurrentUser = async () => {
  const res = await axios.get('/auth/me', { withCredentials: true });
  return res.data;
};

// ✅ Logout user
export const logoutUser = async () => {
  const res = await axios.get('/auth/logout', { withCredentials: true });
  return res.data;
};
