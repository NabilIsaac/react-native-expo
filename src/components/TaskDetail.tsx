import * as React from 'react';
import { StyleSheet } from 'react-nativescript';
import { Task } from '../types/task';
import { format } from 'date-fns';

interface TaskDetailProps {
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
}

export function TaskDetail({ task, onEdit, onDelete }: TaskDetailProps) {
  return (
    <scrollView style={styles.container}>
      <stackLayout style={styles.content}>
        <label text={task.title} style={styles.title} />
        <label text={task.status.toUpperCase()} style={styles.status} />
        <label text={task.description} style={styles.description} textWrap={true} />
        
        <gridLayout columns="*, *" style={styles.dates}>
          <stackLayout col="0">
            <label text="Created" style={styles.dateLabel} />
            <label text={format(new Date(task.created_at), 'PPp')} style={styles.dateValue} />
          </stackLayout>
          <stackLayout col="1">
            <label text="Updated" style={styles.dateLabel} />
            <label text={format(new Date(task.updated_at), 'PPp')} style={styles.dateValue} />
          </stackLayout>
        </gridLayout>

        <button text="Edit Task" onTap={onEdit} style={styles.editButton} />
        <button text="Delete Task" onTap={onDelete} style={styles.deleteButton} />
      </stackLayout>
    </scrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  status: {
    fontSize: 14,
    backgroundColor: '#e0e0e0',
    padding: 4,
    borderRadius: 4,
    marginBottom: 16,
    width: 'auto',
    alignSelf: 'flex-start',
  },
  description: {
    fontSize: 16,
    marginBottom: 24,
  },
  dates: {
    marginBottom: 24,
  },
  dateLabel: {
    fontSize: 12,
    color: '#666',
  },
  dateValue: {
    fontSize: 14,
  },
  editButton: {
    backgroundColor: '#2e6ddf',
    color: 'white',
    padding: 12,
    borderRadius: 4,
    marginBottom: 8,
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    color: 'white',
    padding: 12,
    borderRadius: 4,
  },
});