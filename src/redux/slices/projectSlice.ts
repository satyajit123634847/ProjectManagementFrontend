import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { addProjectApi, fetchProjectsApi, deleteProjectApi } from '../../api/api';

interface Project {
    _id: any;
    id: number;
    name: string;
    description: string;
}

interface ProjectState {
    loading: boolean;
    error: string | null;
    projects: Project[];
}

const initialState: ProjectState = {
    loading: false,
    error: null,
    projects: [],
};


export const addProject = createAsyncThunk<Project, Project, { rejectValue: string }>(
    'projects/addProject',
    async (projectData, { rejectWithValue }) => {
        try {
            const response = await addProjectApi(projectData);
            return response; 
        } catch (error) {
            return rejectWithValue((error as Error).message || 'Failed to add project');
        }
    }
);


export const fetchProjects = createAsyncThunk<Project[], void, { rejectValue: string }>(
    'projects/fetchProjects',
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetchProjectsApi();
            return response.data; 
        } catch (error) {
            return rejectWithValue((error as Error).message || 'Failed to fetch projects');
        }
    }
);


export const deleteProject = createAsyncThunk<number, number, { rejectValue: string }>(
    'projects/deleteProject',
    async (projectId, { rejectWithValue }) => {
        try {
            await deleteProjectApi(projectId);
            return projectId; 
        } catch (error) {
            return rejectWithValue((error as Error).message || 'Failed to delete project');
        }
    }
);

const projectSlice = createSlice({
    name: 'projects',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(addProject.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(addProject.fulfilled, (state, action: PayloadAction<Project>) => {
            state.loading = false;
            state.projects.push(action.payload);
        });
        builder.addCase(addProject.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || 'Failed to add project';
        });
        builder.addCase(fetchProjects.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchProjects.fulfilled, (state, action: PayloadAction<Project[]>) => {
            state.loading = false;
            state.projects = action.payload;
        });
        builder.addCase(fetchProjects.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || 'Failed to fetch projects';
        });
        builder.addCase(deleteProject.fulfilled, (state, action: PayloadAction<number>) => {
            state.projects = state.projects.filter(project => project.id !== action.payload);
        });
        builder.addCase(deleteProject.rejected, (state, action) => {
            state.error = action.payload || 'Failed to delete project';
        });
    },
});

export default projectSlice.reducer;
