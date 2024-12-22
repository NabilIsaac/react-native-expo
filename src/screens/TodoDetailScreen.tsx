import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { getTask, deleteTask } from '../services/api';
import { Task } from '../types/task';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';

type RootStackParamList = {
    TodoList: undefined;
    TodoDetail: { taskId: number };
    TodoForm: { taskId?: number };
};

type TodoDetailScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'TodoDetail'>;
type TodoDetailScreenRouteProp = RouteProp<RootStackParamList, 'TodoDetail'>;

export const TodoDetailScreen = () => {
    const [task, setTask] = useState<Task | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const navigation = useNavigation<TodoDetailScreenNavigationProp>();
    const route = useRoute<TodoDetailScreenRouteProp>();
    const { taskId } = route.params;

    const loadTask = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getTask(taskId.toString());
            setTask(data);
        } catch (err) {
            setError('Failed to load task');
            console.error('Error loading task:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        Alert.alert(
            'Delete Task',
            'Are you sure you want to delete this task?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteTask(taskId.toString());
                            navigation.goBack();
                        } catch (err) {
                            Alert.alert('Error', 'Failed to delete task');
                            console.error('Error deleting task:', err);
                        }
                    },
                },
            ]
        );
    };

    useEffect(() => {
        loadTask();
    }, [taskId]);

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error || !task) {
        return <ErrorMessage message={error || 'Task not found'} />;
    }

    const formatStatus = (status: string | undefined) => {
        if (!status) return 'UNKNOWN';
        return status.replace('_', ' ').toUpperCase();
    };

    const getStatusColor = (status: Task['status']) => {
        switch (status) {
            case 'not_started':
                return '#007AFF';
            case 'in_progress':
                return '#FF9500';
            case 'completed':
                return '#34C759';
            default:
                return '#999';
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>{task.title || 'Untitled Task'}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(task.status) }]}>
                    <Text style={styles.statusText}>
                        {formatStatus(task.status)}
                    </Text>
                </View>
            </View>

            <Text style={styles.sectionTitle}>Details</Text>
            <Text style={styles.details}>
                {task.details || 'No details provided'}
            </Text>

            <Text style={styles.sectionTitle}>Created</Text>
            <Text style={styles.date}>
                {task.created_at 
                    ? new Date(task.created_at).toLocaleDateString()
                    : 'Date not available'
                }
            </Text>

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[styles.button, styles.editButton]}
                    onPress={() => navigation.navigate('TodoForm', { taskId: task.id })}
                >
                    <Text style={[styles.buttonText, styles.editButtonText]}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.button, styles.deleteButton]}
                    onPress={handleDelete}
                >
                    <Text style={[styles.buttonText, styles.deleteButtonText]}>
                        Delete
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        flex: 1,
        marginRight: 12,
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    statusText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 12,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        color: '#666',
    },
    details: {
        fontSize: 16,
        marginBottom: 24,
        lineHeight: 24,
    },
    date: {
        fontSize: 16,
        marginBottom: 24,
        color: '#666',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 'auto',
        paddingTop: 16,
    },
    button: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        marginHorizontal: 8,
    },
    buttonText: {
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '600',
    },
    editButton: {
        backgroundColor: '#007AFF',
    },
    editButtonText: {
        color: '#fff',
    },
    deleteButton: {
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: '#FF3B30',
    },
    deleteButtonText: {
        color: '#FF3B30',
    },
});