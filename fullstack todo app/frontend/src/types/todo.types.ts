// src/types/todo.types.ts
export type TodoItem = {
    id: string
    text: string
    isDone: boolean
    createdAt: string // Consider using Date type if transforming, otherwise string for ISO
    updatedAt: string // Consider using Date type if transforming, otherwise string for ISO
}

export interface ServiceResponse<T = unknown> {
    // Using unknown for T default
    success: boolean
    message: string
    responseObject: T
    statusCode: number // Added statusCode as it's part of the backend response
}
