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
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Picker } from '@react-native-picker/picker';
import { Task, TaskStatus } from '../../types/task';
import { getTask, createTask, updateTask } from '../../services/api';

type RootStackParamList = {
    TodoList: undefined;
    TodoForm: { taskId?: number };
    TodoDetail: { taskId: number };
};

type TaskFormScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'TodoForm'>;
type TaskFormScreenRouteProp = RouteProp<RootStackParamList, 'TodoForm'>;

export const TaskFormScreen = () => {
    const [title, setTitle] = useState('');
    const [details, setDetails] = useState('');
    const [status, setStatus] = useState<TaskStatus>('not_started');
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);

    const navigation = useNavigation<TaskFormScreenNavigationProp>();
    const route = useRoute<TaskFormScreenRouteProp>();
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
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={status}
                            onValueChange={(value) => setStatus(value as TaskStatus)}
                            style={styles.picker}
                        >
                            <Picker.Item label="Not Started" value="not_started" />
                            <Picker.Item label="In Progress" value="in_progress" />
                            <Picker.Item label="Completed" value="completed" />
                        </Picker>
                    </View>

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
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        marginBottom: 16,
        backgroundColor: '#fff',
    },
    picker: {
        height: 50,
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
});