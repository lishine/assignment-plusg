import { v4 as uuidv4 } from 'uuid'

import { CreateTodoDto, Todo, UpdateTodoDto } from './todoModel'

// In-memory store for ToDo items
const todos: Todo[] = []

export const todoRepository = {
	async create(data: CreateTodoDto): Promise<Todo> {
		const now = new Date()
		const newTodo: Todo = {
			id: uuidv4(),
			...data,
			isDone: data.isDone ?? false, // Ensure default value if not provided
			createdAt: now,
			updatedAt: now,
		}
		todos.push(newTodo)
		return newTodo
	},

	async findAll(): Promise<Todo[]> {
		return [...todos] // Return a copy to prevent direct modification
	},

	async findById(id: string): Promise<Todo | null> {
		const todo = todos.find((t) => {
			return t.id === id
		})
		return todo ? { ...todo } : null // Return a copy
	},

	async update(id: string, data: UpdateTodoDto): Promise<Todo | null> {
		const todoIndex = todos.findIndex((t) => {
			return t.id === id
		})
		if (todoIndex === -1) {
			return null
		}

		const updatedTodo: Todo = {
			...todos[todoIndex],
			...data,
			updatedAt: new Date(),
		}
		todos[todoIndex] = updatedTodo
		return { ...updatedTodo } // Return a copy
	},

	async remove(id: string): Promise<boolean> {
		const todoIndex = todos.findIndex((t) => {
			return t.id === id
		})
		if (todoIndex !== -1) {
			todos.splice(todoIndex, 1)
			return true
		}
		return false
	},
}
