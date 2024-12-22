import { Task } from '../types/task';

const API_URL = 'https://oversight.pokkada.com/api/todos';

interface PaginatedResponse<T> {
    data: T[];
    links: {
        first: string;
        last: string;
        prev: string | null;
        next: string | null;
    };
    meta: {
        current_page: number;
        from: number;
        last_page: number;
        path: string;
        per_page: number;
        to: number;
        total: number;
    };
}

export const getTasks = async (): Promise<Task[]> => {
    try {
        const response = await fetch(API_URL);
        console.log('Response status:', response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('API Error:', errorText);
            throw new Error(`API returned ${response.status}: ${errorText}`);
        }
        
        const json = await response.json() as PaginatedResponse<Task>;
        // console.log('API Response:', json);
        return json.data;
    } catch (error) {
        console.error('Fetch error:', error);
        throw new Error(`Failed to fetch tasks: ${error instanceof Error ? error.message : String(error)}`);
    }
};

export const getTask = async (id: string): Promise<Task> => {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        // console.log('Response status:', response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('API Error:', errorText);
            throw new Error(`API returned ${response.status}: ${errorText}`);
        }
        const json = await response.json();
        return json.data;
    } catch (error) {
        console.error('Fetch error:', error);
        throw new Error(`Failed to fetch task: ${error instanceof Error ? error.message : String(error)}`);
    }
};

export const createTask = async (data: Partial<Task>): Promise<Task> => {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: data.title,
                details: data.details,
                status: data.status || 'not_started',
            }),
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('API Error:', errorText);
            throw new Error(`API returned ${response.status}: ${errorText}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Fetch error:', error);
        throw new Error(`Failed to create task: ${error instanceof Error ? error.message : String(error)}`);
    }
};

export const updateTask = async (id: string, data: Partial<Task>): Promise<Task> => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: data.title,
                details: data.details,
                status: data.status,
            }),
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('API Error:', errorText);
            throw new Error(`API returned ${response.status}: ${errorText}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Fetch error:', error);
        throw new Error(`Failed to update task: ${error instanceof Error ? error.message : String(error)}`);
    }
};

export const deleteTask = async (id: string): Promise<void> => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('API Error:', errorText);
            throw new Error(`API returned ${response.status}: ${errorText}`);
        }
    } catch (error) {
        console.error('Fetch error:', error);
        throw new Error(`Failed to delete task: ${error instanceof Error ? error.message : String(error)}`);
    }
};