import { describe, it, expect, vi, beforeEach } from 'vitest'
import { StatusCodes } from 'http-status-codes'
import type { Mocked } from 'vitest'

import { TodoService } from '../todoService'
import { todoRepository } from '../todoRepository'
import { CreateTodoDto, Todo, UpdateTodoDto } from '../todoModel'

vi.mock('../todoRepository')

describe('TodoService', () => {
	let todoServiceInstance: TodoService
	let mockRepository: Mocked<typeof todoRepository>

	const now = new Date()
	const mockTodos: Todo[] = [
		{ id: '1', text: 'Test Todo 1', isDone: false, createdAt: now, updatedAt: now },
		{ id: '2', text: 'Test Todo 2', isDone: true, createdAt: now, updatedAt: now },
	]

	beforeEach(() => {
		// Reset mocks before each test
		vi.resetAllMocks()
		// It's important to cast the mock to the correct type
		mockRepository = todoRepository as Mocked<typeof todoRepository>
		todoServiceInstance = new TodoService(mockRepository)
	})

	describe('create', () => {
		it('should create a new todo item successfully', async () => {
			const createDto: CreateTodoDto = { text: 'New Todo', isDone: false }
			const newTodo: Todo = { ...createDto, id: '3', createdAt: now, updatedAt: now } // isDone is part of createDto
			mockRepository.create.mockResolvedValue(newTodo)

			const result = await todoServiceInstance.create(createDto)

			expect(mockRepository.create).toHaveBeenCalledWith(createDto)
			expect(result.success).toBe(true)
			expect(result.statusCode).toBe(StatusCodes.CREATED)
			expect(result.message).toBe('ToDo item created successfully')
			expect(result.responseObject).toEqual(newTodo)
		})

		it('should handle errors during todo creation', async () => {
			const createDto: CreateTodoDto = { text: 'New Todo', isDone: false }
			mockRepository.create.mockRejectedValue(new Error('Database error'))

			const result = await todoServiceInstance.create(createDto)

			expect(result.success).toBe(false)
			expect(result.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
			expect(result.message).toBe('An error occurred while creating the ToDo item.')
			expect(result.responseObject).toBeNull()
		})
	})

	describe('findAll', () => {
		it('should return all todo items', async () => {
			mockRepository.findAll.mockResolvedValue(mockTodos)

			const result = await todoServiceInstance.findAll()

			expect(mockRepository.findAll).toHaveBeenCalledTimes(1)
			expect(result.success).toBe(true)
			expect(result.statusCode).toBe(StatusCodes.OK)
			expect(result.message).toBe('ToDo items retrieved successfully')
			expect(result.responseObject).toEqual(mockTodos)
		})

		it('should return an empty array if no todo items are found', async () => {
			mockRepository.findAll.mockResolvedValue([])

			const result = await todoServiceInstance.findAll()

			expect(result.success).toBe(true)
			expect(result.statusCode).toBe(StatusCodes.OK)
			expect(result.message).toBe('No ToDo items found')
			expect(result.responseObject).toEqual([])
		})

		it('should handle errors during findAll', async () => {
			mockRepository.findAll.mockRejectedValue(new Error('Database error'))

			const result = await todoServiceInstance.findAll()

			expect(result.success).toBe(false)
			expect(result.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
			expect(result.message).toBe('An error occurred while retrieving ToDo items.')
			expect(result.responseObject).toBeNull()
		})
	})

	describe('findById', () => {
		it('should return a todo item for a valid ID', async () => {
			const testId = '1'
			const mockTodo = mockTodos[0]
			mockRepository.findById.mockResolvedValue(mockTodo)

			const result = await todoServiceInstance.findById(testId)

			expect(mockRepository.findById).toHaveBeenCalledWith(testId)
			expect(result.success).toBe(true)
			expect(result.statusCode).toBe(StatusCodes.OK)
			expect(result.message).toBe('ToDo item retrieved successfully')
			expect(result.responseObject).toEqual(mockTodo)
		})

		it('should return a not found error for a non-existent ID', async () => {
			const testId = 'non-existent-id'
			mockRepository.findById.mockResolvedValue(null)

			const result = await todoServiceInstance.findById(testId)

			expect(result.success).toBe(false)
			expect(result.statusCode).toBe(StatusCodes.NOT_FOUND)
			expect(result.message).toBe('ToDo item not found')
			expect(result.responseObject).toBeNull()
		})

		it('should handle errors during findById', async () => {
			const testId = '1'
			mockRepository.findById.mockRejectedValue(new Error('Database error'))

			const result = await todoServiceInstance.findById(testId)

			expect(result.success).toBe(false)
			expect(result.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
			expect(result.message).toBe('An error occurred while retrieving the ToDo item.')
			expect(result.responseObject).toBeNull()
		})
	})

	describe('update', () => {
		const testId = '1'
		const updateDto: UpdateTodoDto = { text: 'Updated Todo', isDone: true }
		const existingTodo: Todo = { ...mockTodos[0] }
		const updatedTodo: Todo = { ...existingTodo, ...updateDto, updatedAt: new Date() }

		it('should update a todo item successfully', async () => {
			mockRepository.findById.mockResolvedValue(existingTodo)
			mockRepository.update.mockResolvedValue(updatedTodo)

			const result = await todoServiceInstance.update(testId, updateDto)

			expect(mockRepository.findById).toHaveBeenCalledWith(testId)
			expect(mockRepository.update).toHaveBeenCalledWith(testId, updateDto)
			expect(result.success).toBe(true)
			expect(result.statusCode).toBe(StatusCodes.OK)
			expect(result.message).toBe('ToDo item updated successfully')
			expect(result.responseObject).toEqual(updatedTodo)
		})

		it('should return not found if todo to update does not exist', async () => {
			mockRepository.findById.mockResolvedValue(null)

			const result = await todoServiceInstance.update(testId, updateDto)

			expect(mockRepository.findById).toHaveBeenCalledWith(testId)
			expect(mockRepository.update).not.toHaveBeenCalled()
			expect(result.success).toBe(false)
			expect(result.statusCode).toBe(StatusCodes.NOT_FOUND)
			expect(result.message).toBe('ToDo item not found')
			expect(result.responseObject).toBeNull()
		})

		it('should handle errors if repository update fails', async () => {
			mockRepository.findById.mockResolvedValue(existingTodo)
			mockRepository.update.mockResolvedValue(null) // Simulate update failure

			const result = await todoServiceInstance.update(testId, updateDto)
			expect(result.success).toBe(false)
			expect(result.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
			expect(result.message).toBe('An error occurred while updating the ToDo item.')
			expect(result.responseObject).toBeNull()
		})

		it('should handle exceptions during update', async () => {
			mockRepository.findById.mockRejectedValue(new Error('Database error during find'))

			const result = await todoServiceInstance.update(testId, updateDto)

			expect(result.success).toBe(false)
			expect(result.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
			expect(result.message).toBe('An error occurred while updating the ToDo item.')
			expect(result.responseObject).toBeNull()
		})
	})

	describe('remove', () => {
		const testId = '1'
		const existingTodo: Todo = { ...mockTodos[0] }

		it('should remove a todo item successfully', async () => {
			mockRepository.findById.mockResolvedValue(existingTodo)
			mockRepository.remove.mockResolvedValue(true)

			const result = await todoServiceInstance.remove(testId)

			expect(mockRepository.findById).toHaveBeenCalledWith(testId)
			expect(mockRepository.remove).toHaveBeenCalledWith(testId)
			expect(result.success).toBe(true)
			expect(result.statusCode).toBe(StatusCodes.NO_CONTENT)
			expect(result.message).toBe('ToDo item deleted successfully')
			expect(result.responseObject).toBeNull()
		})

		it('should return not found if todo to remove does not exist', async () => {
			mockRepository.findById.mockResolvedValue(null)

			const result = await todoServiceInstance.remove(testId)

			expect(mockRepository.findById).toHaveBeenCalledWith(testId)
			expect(mockRepository.remove).not.toHaveBeenCalled()
			expect(result.success).toBe(false)
			expect(result.statusCode).toBe(StatusCodes.NOT_FOUND)
			expect(result.message).toBe('ToDo item not found')
			expect(result.responseObject).toBeNull()
		})

		it('should handle errors if repository remove fails', async () => {
			mockRepository.findById.mockResolvedValue(existingTodo)
			mockRepository.remove.mockResolvedValue(false) // Simulate remove failure

			const result = await todoServiceInstance.remove(testId)

			expect(result.success).toBe(false)
			expect(result.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
			expect(result.message).toBe('An error occurred while deleting the ToDo item.')
			expect(result.responseObject).toBeNull()
		})

		it('should handle exceptions during remove', async () => {
			mockRepository.findById.mockRejectedValue(new Error('Database error during find'))

			const result = await todoServiceInstance.remove(testId)

			expect(result.success).toBe(false)
			expect(result.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
			expect(result.message).toBe('An error occurred while deleting the ToDo item.')
			expect(result.responseObject).toBeNull()
		})
	})
})
