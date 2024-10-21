import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginUser } from '../../api/api';

interface AuthState {
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  token: localStorage.getItem('token') || null,
  loading: false,
  error: null,
};

export const login = createAsyncThunk<string, { email: string; password: string }, { rejectValue: string }>(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await loginUser(credentials);
      localStorage.setItem('token', response.data.access_token);
      return response.data.access_token;
    } catch (error) {
      return rejectWithValue((error as Error).message || 'Login failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.token = null;
      state.error = null;
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (state, action) => {
      state.token = action.payload;
      state.loading = false;
      state.error = null;
    });
    builder.addCase(login.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.error = action.payload || 'Failed to login';
      state.loading = false;
    });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
