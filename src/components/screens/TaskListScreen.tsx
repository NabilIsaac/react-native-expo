import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { Task } from '../../types/task';
import { getTasks } from '../../services/api';
import { TaskList } from '../TaskList';

type RootStackParamList = {
    TaskList: undefined;
    TaskForm: { taskId?: string };
    TaskDetail: { taskId: string };
};

type TaskListScreenProps = {
    route: RouteProp<RootStackParamList, 'TaskList'>;
    navigation: NativeStackNavigationProp<RootStackParamList, 'TaskList'>;
};

export function TaskListScreen({ navigation }: TaskListScreenProps) {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);

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

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => ({
                onPress: () => navigation.navigate('TaskForm', {}),
                title: 'Add Task'
            })
        });
    }, [navigation]);

    if (loading) {
        return (
            <View style={styles.loading}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <TaskList
                tasks={tasks}
                onTaskPress={(taskId) => navigation.navigate('TaskDetail', { taskId })}
                onRefresh={loadTasks}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});