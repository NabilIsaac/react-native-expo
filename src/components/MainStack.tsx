import { BaseNavigationContainer } from '@react-navigation/core';
import * as React from "react";
import { stackNavigatorFactory } from "react-nativescript-navigation";
import { TaskListScreen } from "./screens/TaskListScreen";
import { TaskDetailScreen } from "./screens/TaskDetailScreen";
import { TaskFormScreen } from "./screens/TaskFormScreen";

const StackNavigator = stackNavigatorFactory();

export const MainStack = () => (
    <BaseNavigationContainer>
        <StackNavigator.Navigator
            initialRouteName="TaskList"
            screenOptions={{
                headerStyle: {
                    backgroundColor: "#2e6ddf",
                },
                headerTintColor: "white",
            }}
        >
            <StackNavigator.Screen
                name="TaskList"
                component={TaskListScreen}
                options={{ title: "Tasks" }}
            />
            <StackNavigator.Screen
                name="TaskDetail"
                component={TaskDetailScreen}
                options={{ title: "Task Details" }}
            />
            <StackNavigator.Screen
                name="TaskForm"
                component={TaskFormScreen}
                options={({ route }) => ({
                    title: route.params?.taskId ? "Edit Task" : "New Task"
                })}
            />
        </StackNavigator.Navigator>
    </BaseNavigationContainer>
);