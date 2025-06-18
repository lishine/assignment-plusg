import { useZustandCreate } from '../../utils/useZustandCreate'
import type { TodoItem } from '../../types/todo.types'
import { todoApiService } from '../../services/todoApiService'

type TodoState = {
    todos: TodoItem[]
    isLoading: boolean
    error: string | null
    fetchTodos: () => Promise<void>
    addTodo: (text: string) => Promise<void>
    removeTodo: (id: string) => Promise<void>
    updateTodo: (id: string, updates: Partial<Pick<TodoItem, 'text' | 'isDone'>>) => Promise<void>
    toggleTodo: (id: string) => Promise<void>
}

export const useAccessTodoStore = () => {
    const useTodosStore = useZustandCreate<TodoState>('todoStore', (set, get) => {
        return {
            todos: [],
            isLoading: false,
            error: null,

            fetchTodos: async () => {
                set({ isLoading: true, error: null })
                try {
                    const todos = await todoApiService.fetchTodos()
                    set({ todos, isLoading: false })
                } catch (err) {
                    set({ error: (err as Error).message || 'Failed to fetch todos', isLoading: false })
                }
            },

            addTodo: async (text: string) => {
                try {
                    const newTodo = await todoApiService.createTodo(text)
                    set((state) => {
                        return { todos: [...state.todos, newTodo] }
                    })
                } catch (err) {
                    // Optionally set error state here
                    console.error('Failed to add todo:', err)
                    // set({ error: (err as Error).message || 'Failed to add todo' });
                }
            },

            removeTodo: async (id: string) => {
                try {
                    await todoApiService.deleteTodo(id)
                    set((state) => {
                        return {
                            todos: state.todos.filter((todo) => {
                                return todo.id !== id
                            }),
                        }
                    })
                } catch (err) {
                    console.error('Failed to remove todo:', err)
                    // set({ error: (err as Error).message || 'Failed to remove todo' });
                }
            },

            updateTodo: async (id: string, updates: Partial<Pick<TodoItem, 'text' | 'isDone'>>) => {
                try {
                    const updatedTodo = await todoApiService.updateTodo(id, updates)
                    set((state) => {
                        return {
                            todos: state.todos.map((todo) => {
                                return todo.id === id ? { ...todo, ...updatedTodo } : todo
                            }),
                        }
                    })
                } catch (err) {
                    console.error('Failed to update todo:', err)
                    // set({ error: (err as Error).message || 'Failed to update todo' });
                }
            },

            toggleTodo: async (id: string) => {
                const todoToToggle = get().todos.find((todo) => {
                    return todo.id === id
                })
                if (todoToToggle) {
                    await get().updateTodo(id, { isDone: !todoToToggle.isDone })
                } else {
                    console.warn(`Todo with id ${id} not found for toggling.`)
                }
            },
        }
    })
    return { useTodosStore }
}
