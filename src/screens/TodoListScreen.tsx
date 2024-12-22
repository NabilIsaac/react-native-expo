import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TaskList } from '../components/TaskList';
import { getTasks } from '../services/api';
import { Task } from '../types/task';
import { FloatingButton } from '../components/FloatingButton';

type RootStackParamList = {
    TodoList: undefined;
    TodoForm: { taskId?: number };
    TodoDetail: { taskId: number };
};

type TodoListScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'TodoList'>;

export const TodoListScreen = () => {
    const [tasks, setTasks] = React.useState<Task[]>([]);
    const [loading, setLoading] = React.useState(true);
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

    React.useEffect(() => {
        loadTasks();
    }, []);

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <TaskList
                tasks={tasks}
                onTaskPress={(taskId) => navigation.navigate('TodoDetail', { taskId })}
                onRefresh={loadTasks}
            />
            <FloatingButton onPress={() => navigation.navigate('TodoForm', {})} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});