import { describe, it, expect, beforeEach } from 'vitest'
import { StatusCodes } from 'http-status-codes'
import request from 'supertest'
import { v4 as uuidv4 } from 'uuid'

import { app } from '../../../server' // Express app instance
import { Todo, CreateTodoDto, UpdateTodoDto } from '../todoModel'
import { ServiceResponse } from '../../../common/models/serviceResponse'
import { todoRepository } from '../todoRepository' // To manage in-memory data for tests

describe('ToDo API Endpoints', () => {
	// Clear todos before each test to ensure a clean state
	beforeEach(async () => {
		const allTodos = await todoRepository.findAll()
		for (const todo of allTodos) {
			await todoRepository.remove(todo.id)
		}
	})

	const compareTodos = (expected: Todo, actual: Todo) => {
		expect(actual.id).toBe(expected.id)
		expect(actual.text).toBe(expected.text)
		expect(actual.isDone).toBe(expected.isDone)
		expect(new Date(actual.createdAt).toISOString()).toBe(new Date(expected.createdAt).toISOString())
		expect(new Date(actual.updatedAt).toISOString()).toBe(new Date(expected.updatedAt).toISOString())
	}

	describe('POST /todos', () => {
		it('should create a new ToDo item', async () => {
			const createDto: CreateTodoDto = { text: 'Test Create Todo', isDone: false }
			const response = await request(app).post('/todos').send(createDto)
			const responseBody: ServiceResponse<Todo> = response.body

			expect(response.statusCode).toBe(StatusCodes.CREATED)
			expect(responseBody.success).toBe(true)
			expect(responseBody.message).toBe('ToDo item created successfully')
			expect(responseBody.responseObject.id).toBeDefined()
			expect(responseBody.responseObject.text).toBe(createDto.text)
			expect(responseBody.responseObject.isDone).toBe(createDto.isDone)
		})

		it('should return bad request for invalid data', async () => {
			const createDto = { text: '' } // Invalid: text is empty
			const response = await request(app).post('/todos').send(createDto)
			const responseBody: ServiceResponse<null> = response.body

			expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST)
			expect(responseBody.success).toBe(false)
			expect(responseBody.message).toContain('Invalid input')
		})
	})

	describe('GET /todos', () => {
		it('should return an empty list if no ToDo items exist', async () => {
			const response = await request(app).get('/todos')
			const responseBody: ServiceResponse<Todo[]> = response.body

			expect(response.statusCode).toBe(StatusCodes.OK)
			expect(responseBody.success).toBe(true)
			expect(responseBody.message).toBe('No ToDo items found') // Service returns this message for empty array
			expect(responseBody.responseObject).toEqual([])
		})

		it('should return a list of ToDo items', async () => {
			const todo1 = await todoRepository.create({ text: 'Todo 1', isDone: false })
			const todo2 = await todoRepository.create({ text: 'Todo 2', isDone: true })

			const response = await request(app).get('/todos')
			const responseBody: ServiceResponse<Todo[]> = response.body

			expect(response.statusCode).toBe(StatusCodes.OK)
			expect(responseBody.success).toBe(true)
			expect(responseBody.message).toBe('ToDo items retrieved successfully')
			expect(responseBody.responseObject.length).toBe(2)
			compareTodos(
				todo1,
				responseBody.responseObject.find((t) => {
					return t.id === todo1.id
				})!
			)
			compareTodos(
				todo2,
				responseBody.responseObject.find((t) => {
					return t.id === todo2.id
				})!
			)
		})
	})

	describe('GET /todos/:id', () => {
		it('should return a ToDo item for a valid ID', async () => {
			const createdTodo = await todoRepository.create({ text: 'Specific Todo', isDone: false })

			const response = await request(app).get(`/todos/${createdTodo.id}`)
			const responseBody: ServiceResponse<Todo> = response.body

			expect(response.statusCode).toBe(StatusCodes.OK)
			expect(responseBody.success).toBe(true)
			expect(responseBody.message).toBe('ToDo item retrieved successfully')
			compareTodos(createdTodo, responseBody.responseObject)
		})

		it('should return not found for a non-existent ID', async () => {
			const nonExistentId = uuidv4()
			const response = await request(app).get(`/todos/${nonExistentId}`)
			const responseBody: ServiceResponse<null> = response.body

			expect(response.statusCode).toBe(StatusCodes.NOT_FOUND)
			expect(responseBody.success).toBe(false)
			expect(responseBody.message).toBe('ToDo item not found')
			expect(responseBody.responseObject).toBeNull()
		})

		it('should return bad request for an invalid ID format', async () => {
			const invalidId = 'not-a-uuid'
			const response = await request(app).get(`/todos/${invalidId}`)
			const responseBody: ServiceResponse<null> = response.body

			expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST)
			expect(responseBody.success).toBe(false)
			expect(responseBody.message).toContain('Invalid input') // Validation middleware message
		})
	})

	describe('PUT /todos/:id', () => {
		it('should update a ToDo item successfully', async () => {
			const createdTodo = await todoRepository.create({ text: 'Original Text', isDone: false })
			const updateDto: UpdateTodoDto = { text: 'Updated Text', isDone: true }

			const response = await request(app).put(`/todos/${createdTodo.id}`).send(updateDto)
			const responseBody: ServiceResponse<Todo> = response.body

			expect(response.statusCode).toBe(StatusCodes.OK)
			expect(responseBody.success).toBe(true)
			expect(responseBody.message).toBe('ToDo item updated successfully')
			expect(responseBody.responseObject.id).toBe(createdTodo.id)
			expect(responseBody.responseObject.text).toBe(updateDto.text)
			expect(responseBody.responseObject.isDone).toBe(updateDto.isDone)
			expect(new Date(responseBody.responseObject.updatedAt) > new Date(createdTodo.updatedAt)).toBe(true)
		})

		it('should return not found when trying to update a non-existent ToDo item', async () => {
			const nonExistentId = uuidv4()
			const updateDto: UpdateTodoDto = { text: 'Updated Text' }
			const response = await request(app).put(`/todos/${nonExistentId}`).send(updateDto)
			const responseBody: ServiceResponse<null> = response.body

			expect(response.statusCode).toBe(StatusCodes.NOT_FOUND)
			expect(responseBody.success).toBe(false)
			expect(responseBody.message).toBe('ToDo item not found')
		})

		it('should return bad request for invalid update data', async () => {
			const createdTodo = await todoRepository.create({ text: 'Original Text', isDone: false })
			const updateDto = { text: '' } // Invalid: text is empty if provided
			const response = await request(app).put(`/todos/${createdTodo.id}`).send(updateDto)
			const responseBody: ServiceResponse<null> = response.body

			expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST)
			expect(responseBody.success).toBe(false)
			expect(responseBody.message).toContain('Invalid input')
		})

		it('should return bad request for an invalid ID format on update', async () => {
			const invalidId = 'not-a-uuid'
			const updateDto: UpdateTodoDto = { text: 'Valid text' }
			const response = await request(app).put(`/todos/${invalidId}`).send(updateDto)
			const responseBody: ServiceResponse<null> = response.body

			expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST)
			expect(responseBody.success).toBe(false)
			expect(responseBody.message).toContain('Invalid input')
		})
	})

	describe('DELETE /todos/:id', () => {
		it('should delete a ToDo item successfully', async () => {
			const createdTodo = await todoRepository.create({ text: 'To Be Deleted', isDone: false })

			const response = await request(app).delete(`/todos/${createdTodo.id}`)
			const responseBody: ServiceResponse<null> = response.body

			expect(response.statusCode).toBe(StatusCodes.NO_CONTENT) // Service returns NO_CONTENT
			// For NO_CONTENT, supertest might not parse a body, or it might be empty.
			// The service itself sends a body for NO_CONTENT, so we check it if present.
			if (response.headers['content-length'] && response.headers['content-length'] !== '0') {
				expect(responseBody.success).toBe(true)
				expect(responseBody.message).toBe('ToDo item deleted successfully')
				expect(responseBody.responseObject).toBeNull()
			}

			// Verify it's actually deleted
			const findResponse = await request(app).get(`/todos/${createdTodo.id}`)
			expect(findResponse.statusCode).toBe(StatusCodes.NOT_FOUND)
		})

		it('should return not found when trying to delete a non-existent ToDo item', async () => {
			const nonExistentId = uuidv4()
			const response = await request(app).delete(`/todos/${nonExistentId}`)
			const responseBody: ServiceResponse<null> = response.body

			expect(response.statusCode).toBe(StatusCodes.NOT_FOUND)
			expect(responseBody.success).toBe(false)
			expect(responseBody.message).toBe('ToDo item not found')
		})

		it('should return bad request for an invalid ID format on delete', async () => {
			const invalidId = 'not-a-uuid'
			const response = await request(app).delete(`/todos/${invalidId}`)
			const responseBody: ServiceResponse<null> = response.body

			expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST)
			expect(responseBody.success).toBe(false)
			expect(responseBody.message).toContain('Invalid input')
		})
	})
})
