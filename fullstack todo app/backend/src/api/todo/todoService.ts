import { StatusCodes } from 'http-status-codes'

import { ServiceResponse } from '../../common/models/serviceResponse'
import { logger } from '../../server'

import { CreateTodoDto, Todo, UpdateTodoDto } from './todoModel'
import { todoRepository } from './todoRepository'

export class TodoService {
	private repository: typeof todoRepository

	constructor(repository: typeof todoRepository = todoRepository) {
		this.repository = repository
	}

	async create(data: CreateTodoDto): Promise<ServiceResponse<Todo | null>> {
		try {
			const newTodo = await this.repository.create(data)
			return ServiceResponse.success<Todo>('ToDo item created successfully', newTodo, StatusCodes.CREATED)
		} catch (ex) {
			const errorMessage = `Error creating ToDo item: ${(ex as Error).message}`
			logger.error(errorMessage)
			return ServiceResponse.failure(
				'An error occurred while creating the ToDo item.',
				null,
				StatusCodes.INTERNAL_SERVER_ERROR
			)
		}
	}

	async findAll(): Promise<ServiceResponse<Todo[] | null>> {
		try {
			const todos = await this.repository.findAll()
			if (!todos || todos.length === 0) {
				return ServiceResponse.success<Todo[]>('No ToDo items found', [], StatusCodes.OK)
			}
			return ServiceResponse.success<Todo[]>('ToDo items retrieved successfully', todos)
		} catch (ex) {
			const errorMessage = `Error retrieving ToDo items: ${(ex as Error).message}`
			logger.error(errorMessage)
			return ServiceResponse.failure(
				'An error occurred while retrieving ToDo items.',
				null,
				StatusCodes.INTERNAL_SERVER_ERROR
			)
		}
	}

	async findById(id: string): Promise<ServiceResponse<Todo | null>> {
		try {
			const todo = await this.repository.findById(id)
			if (!todo) {
				return ServiceResponse.failure('ToDo item not found', null, StatusCodes.NOT_FOUND)
			}
			return ServiceResponse.success<Todo>('ToDo item retrieved successfully', todo)
		} catch (ex) {
			const errorMessage = `Error retrieving ToDo item with id ${id}: ${(ex as Error).message}`
			logger.error(errorMessage)
			return ServiceResponse.failure(
				'An error occurred while retrieving the ToDo item.',
				null,
				StatusCodes.INTERNAL_SERVER_ERROR
			)
		}
	}

	async update(id: string, data: UpdateTodoDto): Promise<ServiceResponse<Todo | null>> {
		try {
			const existingTodo = await this.repository.findById(id)
			if (!existingTodo) {
				return ServiceResponse.failure('ToDo item not found', null, StatusCodes.NOT_FOUND)
			}

			const updatedTodo = await this.repository.update(id, data)
			if (!updatedTodo) {
				// This case should ideally not happen if findById returned a todo,
				// but as a safeguard:
				return ServiceResponse.failure(
					'An error occurred while updating the ToDo item.',
					null,
					StatusCodes.INTERNAL_SERVER_ERROR
				)
			}
			return ServiceResponse.success<Todo>('ToDo item updated successfully', updatedTodo)
		} catch (ex) {
			const errorMessage = `Error updating ToDo item with id ${id}: ${(ex as Error).message}`
			logger.error(errorMessage)
			return ServiceResponse.failure(
				'An error occurred while updating the ToDo item.',
				null,
				StatusCodes.INTERNAL_SERVER_ERROR
			)
		}
	}

	async remove(id: string): Promise<ServiceResponse<null>> {
		try {
			const existingTodo = await this.repository.findById(id)
			if (!existingTodo) {
				return ServiceResponse.failure('ToDo item not found', null, StatusCodes.NOT_FOUND)
			}

			const deleted = await this.repository.remove(id)
			if (!deleted) {
				// This case should ideally not happen if findById returned a todo,
				// but as a safeguard:
				return ServiceResponse.failure(
					'An error occurred while deleting the ToDo item.',
					null,
					StatusCodes.INTERNAL_SERVER_ERROR
				)
			}
			return ServiceResponse.success('ToDo item deleted successfully', null, StatusCodes.NO_CONTENT)
		} catch (ex) {
			const errorMessage = `Error deleting ToDo item with id ${id}: ${(ex as Error).message}`
			logger.error(errorMessage)
			return ServiceResponse.failure(
				'An error occurred while deleting the ToDo item.',
				null,
				StatusCodes.INTERNAL_SERVER_ERROR
			)
		}
	}
}

export const todoService = new TodoService()
