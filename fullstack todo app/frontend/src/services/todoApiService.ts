import { ofetch, FetchError } from 'ofetch'
import type { TodoItem, ServiceResponse } from '../types/todo.types'

const API_BASE_URL = 'http://localhost:8080' // As per instructions

export const todoApiService = {
    fetchTodos: async (): Promise<TodoItem[]> => {
        try {
            const serviceResponse = await ofetch<ServiceResponse<TodoItem[]>>('/todos', { baseURL: API_BASE_URL })
            if (serviceResponse.success && serviceResponse.responseObject !== undefined) {
                return serviceResponse.responseObject
            } else {
                throw new Error(serviceResponse.message || 'Failed to fetch todos but API reported success.')
            }
        } catch (error: unknown) {
            if (error instanceof FetchError && error.data) {
                throw error.data // This is the ServiceResponse from the backend on HTTP error
            }
            throw error // For other unexpected errors
        }
    },

    createTodo: async (text: string): Promise<TodoItem> => {
        try {
            const serviceResponse = await ofetch<ServiceResponse<TodoItem>>('/todos', {
                method: 'POST',
                body: { text },
                baseURL: API_BASE_URL,
            })
            if (serviceResponse.success && serviceResponse.responseObject) {
                return serviceResponse.responseObject
            } else {
                throw new Error(serviceResponse.message || 'Failed to create todo but API reported success.')
            }
        } catch (error: unknown) {
            if (error instanceof FetchError && error.data) {
                throw error.data
            }
            throw error
        }
    },

    updateTodo: async (id: string, updates: Partial<Pick<TodoItem, 'text' | 'isDone'>>): Promise<TodoItem> => {
        try {
            const serviceResponse = await ofetch<ServiceResponse<TodoItem>>(`/todos/${id}`, {
                method: 'PUT',
                body: updates,
                baseURL: API_BASE_URL,
            })
            if (serviceResponse.success && serviceResponse.responseObject) {
                return serviceResponse.responseObject
            } else {
                throw new Error(serviceResponse.message || 'Failed to update todo but API reported success.')
            }
        } catch (error: unknown) {
            if (error instanceof FetchError && error.data) {
                throw error.data
            }
            throw error
        }
    },

    deleteTodo: async (id: string): Promise<void> => {
        try {
            // For DELETE 204, ofetch resolves but might not have a meaningful body.
            // We don't expect ServiceResponse here on success.
            await ofetch<void>(`/todos/${id}`, {
                // Expect void for 204
                method: 'DELETE',
                baseURL: API_BASE_URL,
            })
            // If ofetch does not throw an error for 204, it's considered a success.
            return
        } catch (error: unknown) {
            if (error instanceof FetchError && error.data) {
                throw error.data // This is the ServiceResponse from the backend on HTTP error
            }
            throw error // For other unexpected errors
        }
    },
}
