import React, { useEffect } from 'react'
import { useAccessTodoStore } from './todoStore'
import TodoItem from './TodoItem'
import AddTodoForm from '../../components/AddTodoForm'

const Todos = () => {
    const { useTodosStore } = useAccessTodoStore()
    const todos = useTodosStore((state) => state.todos)
    const isLoading = useTodosStore((state) => state.isLoading)
    const error = useTodosStore((state) => state.error)

    useEffect(() => {
        useTodosStore.getState().fetchTodos()
    }, [useTodosStore])

    if (isLoading) {
        return <p>Loading todos...</p>
    }

    if (error) {
        return <p>Error fetching todos: {error}</p>
    }

    return (
        <>
            <div className="todos-container">
                <h1>My Todos</h1>
                <AddTodoForm />
                {todos.length === 0 && !isLoading && <p>No todos yet. Add one!</p>}
                <div className="todo-list">
                    {todos.map((todo) => (
                        <TodoItem key={todo.id} todo={todo} />
                    ))}
                </div>
            </div>
            <style jsx>{`
                .todos-container {
                    max-width: 600px;
                    margin: 20px auto;
                    padding: 20px;
                    font-family: Arial, sans-serif;
                    border: 1px solid #eee;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }
                h1 {
                    text-align: center;
                    color: #333;
                }
                .todo-list {
                    margin-top: 20px;
                }
                p {
                    text-align: center;
                    color: #666;
                }
            `}</style>
        </>
    )
}

export default Todos
