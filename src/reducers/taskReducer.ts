import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { asyncStorageService } from '../services/asyncStorageService';
import { Task } from '../models/task';
import { TaskPriority } from '../enums/priority';


export interface TaskState {
    tasks: Task[];
    loading: boolean;
    error: string | null;
}

const TASKS_STORAGE_KEY = 'tasks';

const initialState: TaskState = {
    tasks: [],
    loading: false,
    error: null
};

export const fetchTasks = createAsyncThunk(
    'task/fetchTasks',
    async (_, { rejectWithValue }) => {
        try {
            const tasks = await asyncStorageService.get<Task[]>(TASKS_STORAGE_KEY, []);
            return tasks || [];
        } catch (error) {
            return rejectWithValue('Failed to fetch tasks from storage');
        }
    }
);

export const saveTask = createAsyncThunk(
    'task/saveTask',
    async (task: Task, { getState, rejectWithValue }) => {
        try {
            const state = getState() as { task: TaskState };
            const updatedTasks = [...state.task.tasks];

            const existingTaskIndex = updatedTasks.findIndex(t => t.id === task.id);

            if (existingTaskIndex >= 0) {
                updatedTasks[existingTaskIndex] = {
                    ...task,
                    updatedAt: Date.now()
                };
            } else {
                updatedTasks.push(task);
            }

            await asyncStorageService.set(TASKS_STORAGE_KEY, updatedTasks);
            return updatedTasks;
        } catch (error) {
            return rejectWithValue('Failed to save task to storage');
        }
    }
);

export const deleteTask = createAsyncThunk(
    'task/deleteTask',
    async (taskId: string, { getState, rejectWithValue }) => {
        try {
            const state = getState() as { task: TaskState };
            const updatedTasks = state.task.tasks.filter(task => task.id !== taskId);

            await asyncStorageService.set(TASKS_STORAGE_KEY, updatedTasks);
            return taskId;
        } catch (error) {
            return rejectWithValue('Failed to delete task from storage');
        }
    }
);

const taskSlice = createSlice({
    name: 'task',
    initialState,
    reducers: {
        createNewTask: (state, action: PayloadAction<Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'completed'>>) => {
            const newTask: Task = {
                id: Date.now().toString(),
                title: action.payload.title,
                description: action.payload.description,
                completed: false,
                createdAt: Date.now(),
                updatedAt: Date.now(),
                priority: TaskPriority.LOW
            };
            state.tasks.push(newTask);
        },
        updateInformationTask: (state, action: PayloadAction<Partial<Task> & { id: string }>) => {
            const { id, ...updates } = action.payload;
            const taskIndex = state.tasks.findIndex(task => task.id === id);

            if (taskIndex !== -1) {
                state.tasks[taskIndex] = {
                    ...state.tasks[taskIndex],
                    ...updates,
                    updatedAt: Date.now()
                };
            }
        },
        removeTask: (state, action: PayloadAction<string>) => {
            state.tasks = state.tasks.filter(task => task.id !== action.payload);
        },
        setTasks: (state, action: PayloadAction<Task[]>) => {
            state.tasks = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTasks.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTasks.fulfilled, (state, action) => {
                state.loading = false;
                state.tasks = action.payload;
            })
            .addCase(fetchTasks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(saveTask.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(saveTask.fulfilled, (state, action) => {
                state.loading = false;
                state.tasks = action.payload as Task[];
            })
            .addCase(saveTask.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(deleteTask.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteTask.fulfilled, (state, action) => {
                state.loading = false;
                state.tasks = state.tasks.filter(task => task.id !== action.payload);
            })
            .addCase(deleteTask.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    }
});

export const { createNewTask, updateInformationTask, removeTask, setTasks } = taskSlice.actions;
export default taskSlice.reducer;