import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Picker
} from 'react-native';
import { Task } from '../types/task';

interface TaskFormProps {
    initialValues?: Task;
    onSubmit: (data: Partial<Task>) => void;
    onCancel: () => void;
}

    /**
     * Form component for creating or editing a task.
     *
     * @param {TaskFormProps} props
     * @prop {Task} initialValues - The initial values of the task to edit, or undefined if creating a new task.
     * @prop {function} onSubmit - The function to call when the form is submitted, with the new task values as an argument.
     * @prop {function} onCancel - The function to call when the cancel button is pressed.
     */
export function TaskForm({ initialValues, onSubmit, onCancel }: TaskFormProps) {
    const [title, setTitle] = useState(initialValues?.title || '');
    const [details, setDetails] = useState(initialValues?.details || '');
    const [status, setStatus] = useState(initialValues?.status || 'todo');

    const handleSubmit = () => {
        onSubmit({
            title,
            details,
            status,
        });
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.form}>
                <Text style={styles.label}>Title</Text>
                <TextInput
                    value={title}
                    onChangeText={setTitle}
                    style={styles.input}
                    placeholder="Enter task title"
                />

                <Text style={styles.label}>Details</Text>
                <TextInput
                    value={details}
                    onChangeText={setDetails}
                    style={[styles.input, styles.textArea]}
                    placeholder="Enter task details"
                    multiline
                    numberOfLines={4}
                />

                <Text style={styles.label}>Status</Text>
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={status}
                        onValueChange={(itemValue) => setStatus(itemValue)}
                        style={styles.picker}
                    >
                        <Picker.Item label="Not Started" value="not_started" />
                        <Picker.Item label="In Progress" value="in_progress" />
                        <Picker.Item label="Completed" value="completed" />
                    </Picker>
                </View>

                <TouchableOpacity
                    style={styles.button}
                    onPress={handleSubmit}
                >
                    <Text style={styles.buttonText}>
                        {initialValues ? 'Update Task' : 'Create Task'}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.button, styles.cancelButton]}
                    onPress={onCancel}
                >
                    <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    form: {
        padding: 16,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#333',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
        fontSize: 16,
        backgroundColor: '#fff',
    },
    textArea: {
        height: 100,
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
    button: {
        backgroundColor: '#007AFF',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 16,
    },
    cancelButton: {
        backgroundColor: '#666',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});