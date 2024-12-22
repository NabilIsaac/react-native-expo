import React from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    RefreshControl
} from 'react-native';
import { Task } from '../types/task';
import { format } from 'date-fns';

interface TaskListProps {
    tasks: Task[];
    onTaskPress: (taskId: number) => void;
    onRefresh: () => void;
}

export function TaskList({ tasks, onTaskPress, onRefresh }: TaskListProps) {
    const [refreshing, setRefreshing] = React.useState(false);

    const handleRefresh = async () => {
        setRefreshing(true);
        await onRefresh();
        setRefreshing(false);
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

    const formatStatus = (status: string | undefined) => {
        if (!status) return 'UNKNOWN';
        return status.replace('_', ' ').toUpperCase();
    };

    const renderItem = ({ item }: { item: Task }) => (
        <TouchableOpacity
            style={styles.taskItem}
            onPress={() => onTaskPress(item.id)}
        >
            <View style={styles.taskHeader}>
                <Text style={styles.taskTitle}>{item.title || 'Untitled Task'}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                    <Text style={styles.statusText}>
                        {formatStatus(item.status)}
                    </Text>
                </View>
            </View>
            <Text style={styles.taskDescription} numberOfLines={2}>
                {item.details || 'No details provided'}
            </Text>
            <Text style={styles.taskDate}>
                {item.created_at ? format(new Date(item.created_at), 'MMM d, yyyy') : 'Date not available'}
            </Text>
        </TouchableOpacity>
    );

    return (
        <FlatList
            data={tasks}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            style={styles.list}
            contentContainerStyle={styles.listContent}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                />
            }
        />
    );
}

const styles = StyleSheet.create({
    list: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    listContent: {
        padding: 16,
    },
    taskItem: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    taskHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    taskTitle: {
        fontSize: 16,
        fontWeight: '600',
        flex: 1,
        marginRight: 8,
    },
    taskDescription: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '500',
        color: '#fff',
    },
    taskDate: {
        fontSize: 12,
        color: '#999',
    },
});