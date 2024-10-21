import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { addUserApi, fetchUsersApi, deleteUserApi } from '../../api/api';

interface User {
    _id: string;
    email: string;
    name: string;
}

interface UserState {
    loading: boolean;
    error: string | null;
    users: User[];
}

const initialState: UserState = {
    loading: false,
    error: null,
    users: [],
};


export const addUser = createAsyncThunk<User, Omit<User, '_id'>, { rejectValue: string }>(
    'users/addUser',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await addUserApi(userData);
            return response; 
        } catch (error) {
            return rejectWithValue((error as Error).message || 'Failed to add user');
        }
    }
);


export const fetchUsers = createAsyncThunk<User[], void, { rejectValue: string }>(
    'users/fetchUsers',
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetchUsersApi();
            return response.data; 
        } catch (error) {
            return rejectWithValue((error as Error).message || 'Failed to fetch users');
        }
    }
);


export const deleteUser = createAsyncThunk<string, string, { rejectValue: string }>(
    'users/deleteUser',
    async (userId, { rejectWithValue }) => {
        try {
            await deleteUserApi(userId);
            return userId; 
        } catch (error) {
            return rejectWithValue((error as Error).message || 'Failed to delete user');
        }
    }
);

const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(addUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(addUser.fulfilled, (state, action: PayloadAction<User>) => {
            state.loading = false;
            state.users.push(action.payload);
        });
        builder.addCase(addUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || 'Failed to add user';
        });
        builder.addCase(fetchUsers.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
            state.loading = false;
            state.users = action.payload;
        });
        builder.addCase(fetchUsers.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || 'Failed to fetch users';
        });
        builder.addCase(deleteUser.fulfilled, (state, action: PayloadAction<string>) => {
            state.users = state.users.filter(user => user._id !== action.payload);
        });
        builder.addCase(deleteUser.rejected, (state, action) => {
            state.error = action.payload || 'Failed to delete user';
        });
    },
});

export default userSlice.reducer;
