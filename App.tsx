import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TodoListScreen } from './src/screens/TodoListScreen';
import { TodoDetailScreen } from './src/screens/TodoDetailScreen';
import { TodoFormScreen } from './src/screens/TodoFormScreen';
import { RootStackParamList } from './src/types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name="TodoList" 
          component={TodoListScreen} 
          options={{ title: 'Todos' }} 
        />
        <Stack.Screen 
          name="TodoDetail" 
          component={TodoDetailScreen} 
          options={{ title: 'Todo Details' }} 
        />
        <Stack.Screen 
          name="TodoForm" 
          component={TodoFormScreen} 
          options={({ route }) => ({
            title: route.params?.todoId ? 'Edit Todo' : 'New Todo'
          })} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}