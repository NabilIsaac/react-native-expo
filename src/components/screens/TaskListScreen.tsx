import React, { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Text,
    ActivityIndicator,
    ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Task, TaskStatus } from '../../types/task';
import { getTasks } from '../../services/api';
import { TaskList } from '../TaskList';

type RootStackParamList = {
    TodoList: undefined;
    TodoForm: { taskId?: number };
    TodoDetail: { taskId: number };
};

type TaskListScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'TodoList'>;

const STATUS_FILTERS: { label: string; value: TaskStatus | 'all' }[] = [
    { label: 'All', value: 'all' },
    { label: 'Not Started', value: 'not_started' },
    { label: 'In Progress', value: 'in_progress' },
    { label: 'Completed', value: 'completed' },
];

export const TaskListScreen = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedStatus, setSelectedStatus] = useState<TaskStatus | 'all'>('all');
    const navigation = useNavigation<TaskListScreenNavigationProp>();

    const loadTasks = async () => {
        try {
            setLoading(true);
            const data = await getTasks();
            setTasks(data);
        } catch (error) {
            console.error('Error loading tasks:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTasks();
    }, []);

    const filteredTasks = tasks.filter(task => 
        selectedStatus === 'all' ? true : task.status === selectedStatus
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.filterContainer}
            >
                {STATUS_FILTERS.map((filter) => (
                    <TouchableOpacity
                        key={filter.value}
                        style={[
                            styles.filterButton,
                            selectedStatus === filter.value && styles.filterButtonActive
                        ]}
                        onPress={() => setSelectedStatus(filter.value)}
                    >
                        <Text style={[
                            styles.filterButtonText,
                            selectedStatus === filter.value && styles.filterButtonTextActive
                        ]}>
                            {filter.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <TaskList
                tasks={filteredTasks}
                onTaskPress={(taskId) => navigation.navigate('TodoDetail', { taskId })}
                onRefresh={loadTasks}
            />

            <TouchableOpacity
                style={styles.fab}
                onPress={() => navigation.navigate('TodoForm')}
            >
                <Text style={styles.fabText}>+</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    filterContainer: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    filterButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#f5f5f5',
        marginRight: 8,
    },
    filterButtonActive: {
        backgroundColor: '#007AFF',
    },
    filterButtonText: {
        fontSize: 14,
        color: '#666',
    },
    filterButtonTextActive: {
        color: '#fff',
        fontWeight: '600',
    },
    fab: {
        position: 'absolute',
        right: 16,
        bottom: 16,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#007AFF',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    fabText: {
        fontSize: 24,
        color: '#fff',
        fontWeight: '600',
    },
});