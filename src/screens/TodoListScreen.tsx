import React, { useState, useCallback } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Text,
    ActivityIndicator,
    Modal,
    Pressable,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Task, TaskStatus } from '../types/task';
import { getTasks } from '../services/api';
import { TaskList } from '../components/TaskList';
import { Ionicons } from '@expo/vector-icons';

type RootStackParamList = {
    TodoList: undefined;
    TodoForm: { taskId?: number };
    TodoDetail: { taskId: number };
};

type TodoListScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'TodoList'>;

const STATUS_FILTERS: { label: string; value: TaskStatus | 'all' }[] = [
    { label: 'All', value: 'all' },
    { label: 'Not Started', value: 'not_started' },
    { label: 'In Progress', value: 'in_progress' },
    { label: 'Completed', value: 'completed' },
];

export const TodoListScreen = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedStatus, setSelectedStatus] = useState<TaskStatus | 'all'>('all');
    const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
    const navigation = useNavigation<TodoListScreenNavigationProp>();

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

    // Refresh tasks when screen comes into focus
    useFocusEffect(
        useCallback(() => {
            loadTasks();
        }, [])
    );

    const filteredTasks = tasks.filter(task => 
        selectedStatus === 'all' ? true : task.status === selectedStatus
    );

    const handleStatusSelect = (status: TaskStatus | 'all') => {
        setSelectedStatus(status);
        setIsFilterModalVisible(false);
    };

    const getStatusLabel = () => {
        return STATUS_FILTERS.find(filter => filter.value === selectedStatus)?.label || 'All';
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.filterButton}
                    onPress={() => setIsFilterModalVisible(true)}
                >
                    <Ionicons name="filter" size={20} color="#007AFF" />
                    <Text style={styles.filterButtonText}>
                        {getStatusLabel()}
                    </Text>
                    <Ionicons name="chevron-down" size={20} color="#007AFF" />
                </TouchableOpacity>
            </View>

            <View style={styles.listContainer}>
                <TaskList
                    tasks={filteredTasks}
                    onTaskPress={(taskId) => navigation.navigate('TodoDetail', { taskId })}
                    onRefresh={loadTasks}
                />
            </View>

            <TouchableOpacity
                style={styles.fab}
                onPress={() => navigation.navigate('TodoForm')}
            >
                <Text style={styles.fabText}>+</Text>
            </TouchableOpacity>

            <Modal
                visible={isFilterModalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setIsFilterModalVisible(false)}
            >
                <Pressable 
                    style={styles.modalOverlay}
                    onPress={() => setIsFilterModalVisible(false)}
                >
                    <View style={styles.modalContent}>
                        {STATUS_FILTERS.map((filter) => (
                            <TouchableOpacity
                                key={filter.value}
                                style={[
                                    styles.modalOption,
                                    selectedStatus === filter.value && styles.modalOptionSelected
                                ]}
                                onPress={() => handleStatusSelect(filter.value)}
                            >
                                <Text style={[
                                    styles.modalOptionText,
                                    selectedStatus === filter.value && styles.modalOptionTextSelected
                                ]}>
                                    {filter.label}
                                </Text>
                                {selectedStatus === filter.value && (
                                    <Ionicons name="checkmark" size={20} color="#007AFF" />
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                </Pressable>
            </Modal>
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
    header: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        backgroundColor: '#fff',
    },
    filterButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    filterButtonText: {
        fontSize: 16,
        color: '#007AFF',
        marginHorizontal: 8,
    },
    listContainer: {
        flex: 1,
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
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 8,
        width: '80%',
        maxWidth: 300,
    },
    modalOption: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderRadius: 8,
    },
    modalOptionSelected: {
        backgroundColor: '#f0f0f0',
    },
    modalOptionText: {
        fontSize: 16,
        color: '#333',
    },
    modalOptionTextSelected: {
        color: '#007AFF',
        fontWeight: '600',
    },
});