import * as React from 'react';
import { Dialogs } from '@nativescript/core';
import { RouteProp } from '@react-navigation/core';
import { FrameNavigationProp } from "react-nativescript-navigation";
import { MainStackParamList } from '../../NavigationParamList';
import { TaskDetail } from '../TaskDetail';
import { Task } from '../../types/task';

type TaskDetailScreenProps = {
    route: RouteProp<MainStackParamList, "TaskDetail">,
    navigation: FrameNavigationProp<MainStackParamList, "TaskDetail">,
};

export function TaskDetailScreen({ route, navigation }: TaskDetailScreenProps) {
    const [task, setTask] = React.useState<Task | null>(null);
    const [loading, setLoading] = React.useState(true);

    const loadTask = async () => {
        try {
            setLoading(true);
            const data = await getTask(route.params.taskId);
            setTask(data);
        } catch (error) {
            console.error('Error loading task:', error);
            navigation.goBack();
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        loadTask();
    }, [route.params.taskId]);

    const handleDelete = async () => {
        const result = await Dialogs.confirm({
            title: "Delete Task",
            message: "Are you sure you want to delete this task?",
            okButtonText: "Delete",
            cancelButtonText: "Cancel"
        });

        if (result) {
            try {
                await deleteTask(route.params.taskId);
                navigation.goBack();
            } catch (error) {
                console.error('Error deleting task:', error);
                Dialogs.alert({
                    title: "Error",
                    message: "Failed to delete task",
                    okButtonText: "OK"
                });
            }
        }
    };

    if (loading || !task) {
        return (
            <flexboxLayout style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <activityIndicator busy={true} />
            </flexboxLayout>
        );
    }

    return (
        <TaskDetail
            task={task}
            onEdit={() => navigation.navigate("TaskForm", { taskId: task.id })}
            onDelete={handleDelete}
        />
    );
}