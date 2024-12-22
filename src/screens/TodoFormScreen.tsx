import React, { useState, useEffect } from 'react';
import {
    View,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Text,
    ActivityIndicator,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Modal,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Task, TaskStatus } from '../types/task';
import { getTask, createTask, updateTask } from '../services/api';

type RootStackParamList = {
    TodoList: undefined;
    TodoForm: { taskId?: number };
    TodoDetail: { taskId: number };
};

type TodoFormScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'TodoForm'>;
type TodoFormScreenRouteProp = RouteProp<RootStackParamList, 'TodoForm'>;

const STATUS_OPTIONS: { label: string; value: TaskStatus }[] = [
    { label: 'Not Started', value: 'not_started' },
    { label: 'In Progress', value: 'in_progress' },
    { label: 'Completed', value: 'completed' },
];

export const TodoFormScreen = () => {
    const [title, setTitle] = useState('');
    const [details, setDetails] = useState('');
    const [status, setStatus] = useState<TaskStatus>('not_started');
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [showStatusModal, setShowStatusModal] = useState(false);

    const navigation = useNavigation<TodoFormScreenNavigationProp>();
    const route = useRoute<TodoFormScreenRouteProp>();
    const taskId = route.params?.taskId;

    useEffect(() => {
        const loadTask = async () => {
            if (!taskId) {
                setInitialLoading(false);
                return;
            }

            try {
                const task = await getTask(taskId.toString());
                setTitle(task.title);
                setDetails(task.details || '');
                setStatus(task.status);
            } catch (error) {
                console.error('Error loading task:', error);
            } finally {
                setInitialLoading(false);
            }
        };

        loadTask();
    }, [taskId]);

    const handleSubmit = async () => {
        if (!title.trim()) {
            alert('Please enter a title');
            return;
        }

        setLoading(true);
        try {
            const taskData = {
                title: title.trim(),
                details: details.trim(),
                status
            };

            if (taskId) {
                await updateTask(taskId.toString(), taskData);
            } else {
                await createTask(taskData);
            }
            navigation.goBack();
        } catch (error) {
            console.error('Error saving task:', error);
            alert('Failed to save task');
        } finally {
            setLoading(false);
        }
    };

    const getStatusLabel = (value: TaskStatus) => {
        return STATUS_OPTIONS.find(option => option.value === value)?.label || 'Unknown';
    };

    if (initialLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <ScrollView style={styles.scrollView}>
                <View style={styles.form}>
                    <Text style={styles.label}>Title</Text>
                    <TextInput
                        style={styles.input}
                        value={title}
                        onChangeText={setTitle}
                        placeholder="Enter task title"
                        autoFocus
                    />

                    <Text style={styles.label}>Details</Text>
                    <TextInput
                        style={[styles.input, styles.detailsInput]}
                        value={details}
                        onChangeText={setDetails}
                        placeholder="Enter task details"
                        multiline
                        numberOfLines={4}
                        textAlignVertical="top"
                    />

                    <Text style={styles.label}>Status</Text>
                    <TouchableOpacity
                        style={styles.statusButton}
                        onPress={() => setShowStatusModal(true)}
                    >
                        <Text style={styles.statusButtonText}>
                            {getStatusLabel(status)}
                        </Text>
                    </TouchableOpacity>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[styles.button, styles.cancelButton]}
                            onPress={() => navigation.goBack()}
                        >
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, styles.submitButton]}
                            onPress={handleSubmit}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.submitButtonText}>
                                    {taskId ? 'Update' : 'Create'}
                                </Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>

            <Modal
                visible={showStatusModal}
                transparent
                animationType="slide"
                onRequestClose={() => setShowStatusModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Select Status</Text>
                        {STATUS_OPTIONS.map((option) => (
                            <TouchableOpacity
                                key={option.value}
                                style={[
                                    styles.statusOption,
                                    status === option.value && styles.selectedStatusOption
                                ]}
                                onPress={() => {
                                    setStatus(option.value);
                                    setShowStatusModal(false);
                                }}
                            >
                                <Text style={[
                                    styles.statusOptionText,
                                    status === option.value && styles.selectedStatusOptionText
                                ]}>
                                    {option.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                        <TouchableOpacity
                            style={styles.modalCloseButton}
                            onPress={() => setShowStatusModal(false)}
                        >
                            <Text style={styles.modalCloseButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollView: {
        flex: 1,
    },
    form: {
        padding: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        color: '#666',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        marginBottom: 16,
        backgroundColor: '#fff',
    },
    detailsInput: {
        height: 120,
        textAlignVertical: 'top',
    },
    statusButton: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
        backgroundColor: '#fff',
    },
    statusButtonText: {
        fontSize: 16,
        color: '#000',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 24,
    },
    button: {
        flex: 1,
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal: 8,
    },
    submitButton: {
        backgroundColor: '#007AFF',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    cancelButton: {
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: '#ddd',
    },
    cancelButtonText: {
        color: '#666',
        fontSize: 16,
        fontWeight: '600',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        padding: 16,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
        textAlign: 'center',
    },
    statusOption: {
        padding: 16,
        borderRadius: 8,
        marginBottom: 8,
    },
    selectedStatusOption: {
        backgroundColor: '#007AFF',
    },
    statusOptionText: {
        fontSize: 16,
        textAlign: 'center',
    },
    selectedStatusOptionText: {
        color: '#fff',
        fontWeight: '600',
    },
    modalCloseButton: {
        marginTop: 8,
        padding: 16,
        borderRadius: 8,
        backgroundColor: '#f5f5f5',
    },
    modalCloseButtonText: {
        fontSize: 16,
        textAlign: 'center',
        color: '#666',
    },
});