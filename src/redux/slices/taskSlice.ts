import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { addTaskApi, fetchTasksApi, deleteTaskApi, updateTaskApi } from '../../api/api';

interface Task {
  _id?: string;
  title: string;
  description: string;
  assignee: string;
  priority: string;
  dueDate: string;
  taskStatus: string;
  project: string;
}

interface TaskState {
  loading: boolean;
  error: string | null;
  tasks: Task[];
  currentTask: Task | null;
}

const initialState: TaskState = {
  loading: false,
  error: null,
  tasks: [],
  currentTask: null,
};

export const addTask = createAsyncThunk<Task, Omit<Task, '_id'>, { rejectValue: string }>(
  'tasks/addTask',
  async (taskData, { rejectWithValue }) => {
    try {
      const response = await addTaskApi(taskData);
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).message || 'Failed to add task');
    }
  }
);

export const fetchTasks = createAsyncThunk<Task[], void, { rejectValue: string }>(
  'tasks/fetchTasks',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchTasksApi();
      return response.data;
    } catch (error) {
      return rejectWithValue((error as Error).message || 'Failed to fetch tasks');
    }
  }
);

export const deleteTask = createAsyncThunk<string, string, { rejectValue: string }>(
  'tasks/deleteTask',
  async (taskId, { rejectWithValue }) => {
    try {
      await deleteTaskApi(taskId);
      return taskId;
    } catch (error) {
      return rejectWithValue((error as Error).message || 'Failed to delete task');
    }
  }
);

export const updateTask = createAsyncThunk<Task, Task, { rejectValue: string }>(
  'tasks/updateTask',
  async (taskData, { rejectWithValue }) => {
    try {
      const response = await updateTaskApi(taskData._id!, taskData);
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).message || 'Failed to update task');
    }
  }
);

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setCurrentTask: (state, action: PayloadAction<Task | null>) => {
      state.currentTask = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addTask.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(addTask.fulfilled, (state, action: PayloadAction<Task>) => {
      state.loading = false;
      state.tasks.push(action.payload);
    });
    builder.addCase(addTask.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Failed to add task';
    });
    builder.addCase(fetchTasks.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchTasks.fulfilled, (state, action: PayloadAction<Task[]>) => {
      state.loading = false;
      state.tasks = action.payload;
    });
    builder.addCase(fetchTasks.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Failed to fetch tasks';
    });
    builder.addCase(deleteTask.fulfilled, (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter(task => task._id !== action.payload);
    });
    builder.addCase(deleteTask.rejected, (state, action) => {
      state.error = action.payload || 'Failed to delete task';
    });
    builder.addCase(updateTask.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateTask.fulfilled, (state, action: PayloadAction<Task>) => {
      state.loading = false;
      const index = state.tasks.findIndex(task => task._id === action.payload._id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
      state.currentTask = null;
    });
    builder.addCase(updateTask.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Failed to update task';
    });
  },
});

export const { setCurrentTask } = taskSlice.actions;
export default taskSlice.reducer;