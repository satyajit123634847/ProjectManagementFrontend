import axios from 'axios';

// Define the Project interface
interface Project {
  id?: number; // Optional for add
  name: string;
  description: string;
}

// Define the User interface
interface User {
  _id?: string; // Optional for add
  email: string;
  name: string;
}

// Define the Task interface
interface Task {
  _id?: string;
  title: string;
  description: string;
  assignee: string; // User ID
  priority: string;
  dueDate: string;
  taskStatus: string;
  project: string; // Project ID
}

const api = axios.create({
  baseURL: 'http://localhost:3001',
});

// Token flow
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add Project
export const addProjectApi = async (projectData: Omit<Project, 'id'>) => {
  try {
    const response = await api.post('/projects', projectData);
    return response.data; 
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to add project.');
    } else {
      throw new Error('Something went wrong while adding the project.');
    }
  }
};

// Fetch Projects
export const fetchProjectsApi = async () => {
  try {
    const response = await api.get('/projects');
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to fetch projects.');
    } else {
      throw new Error('Something went wrong while fetching the projects.');
    }
  }
};

// Delete Project
export const deleteProjectApi = async (projectId: number) => {
  try {
    await api.delete(`/projects/${projectId}`);
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to delete project.');
    } else {
      throw new Error('Something went wrong while deleting the project.');
    }
  }
};

// Login User
export const loginUser = async (credentials: { email: string; password: string }) => {
  try {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to login.');
    } else {
      throw new Error('Something went wrong while logging in.');
    }
  }
};

// Add User
export const addUserApi = async (userData: Omit<User, '_id'>) => {
  try {
    const response = await api.post('/auth/signup', userData);
    return response.data; 
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to add user.');
    } else {
      throw new Error('Something went wrong while adding the user.');
    }
  }
};

// Fetch Users
export const fetchUsersApi = async () => {
  try {
    const response = await api.get('/users');
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to fetch users.');
    } else {
      throw new Error('Something went wrong while fetching the users.');
    }
  }
};

// Delete User
export const deleteUserApi = async (userId: string) => {
  try {
    await api.delete(`/users/${userId}`);
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to delete user.');
    } else {
      throw new Error('Something went wrong while deleting the user.');
    }
  }
};


// Add Task
export const addTaskApi = async (taskData: Omit<Task, '_id'>) => {
  try {
    const response = await api.post('/tasks', taskData);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to add task.');
    } else {
      throw new Error('Something went wrong while adding the task.');
    }
  }
};

// Fetch Tasks
export const fetchTasksApi = async () => {
  try {
    const response = await api.get('/tasks');
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to fetch tasks.');
    } else {
      throw new Error('Something went wrong while fetching the tasks.');
    }
  }
};


// Update Task
export const updateTaskApi = async (taskId: string, taskData: Omit<Task, '_id'>) => {
  try {
    const response = await api.patch(`/tasks/${taskId}`, taskData);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to update task.');
    } else {
      throw new Error('Something went wrong while updating the task.');
    }
  }
};

// Delete Task
export const deleteTaskApi = async (taskId: string) => {
  try {
    await api.delete(`/tasks/${taskId}`);
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to delete task.');
    } else {
      throw new Error('Something went wrong while deleting the task.');
    }
  }
};

export default api;
