import { TaskPriority } from "../enums/priority";

export interface Task {
    id: string;
    name: string;
    priority: TaskPriority;
    description: string;
    completed: boolean;
    createdAt: number;
    updatedAt: number;
}