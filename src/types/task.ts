export interface Task {
    id: number;
    title: string;
    details: string;
    status: 'not_started' | 'in_progress' | 'completed';
    created_at: string;
    updated_at: string;
}

export type TaskStatus = Task['status'];