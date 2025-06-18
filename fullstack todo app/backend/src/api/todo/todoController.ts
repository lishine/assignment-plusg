import type { Request, RequestHandler, Response } from 'express'

import { CreateTodoSchema, UpdateTodoSchema } from './todoModel'
import { todoService } from './todoService'

class TodoController {
	public createTodo: RequestHandler = async (req: Request, res: Response) => {
		const validatedBody = CreateTodoSchema.safeParse(req.body)
		if (!validatedBody.success) {
			res.status(400).send({ message: 'Invalid request body', errors: validatedBody.error.issues })
			return
		}
		const serviceResponse = await todoService.create(validatedBody.data)
		res.status(serviceResponse.statusCode).send(serviceResponse)
	}

	public getTodos: RequestHandler = async (_req: Request, res: Response) => {
		const serviceResponse = await todoService.findAll()
		res.status(serviceResponse.statusCode).send(serviceResponse)
	}

	public getTodoById: RequestHandler = async (req: Request, res: Response) => {
		const { id } = req.params
		const serviceResponse = await todoService.findById(id)
		res.status(serviceResponse.statusCode).send(serviceResponse)
	}

	public updateTodo: RequestHandler = async (req: Request, res: Response) => {
		const { id } = req.params
		const validatedBody = UpdateTodoSchema.safeParse(req.body)
		if (!validatedBody.success) {
			res.status(400).send({ message: 'Invalid request body', errors: validatedBody.error.issues })
			return
		}
		const serviceResponse = await todoService.update(id, validatedBody.data)
		res.status(serviceResponse.statusCode).send(serviceResponse)
	}

	public deleteTodo: RequestHandler = async (req: Request, res: Response) => {
		const { id } = req.params
		const serviceResponse = await todoService.remove(id)
		// For 204 NO_CONTENT, Express sends an empty response if .send() is called.
		// To ensure consistency or if a specific body is desired (even if empty for 204),
		// one might explicitly set it or rely on Express's default behavior.
		// Here, we send the serviceResponse which might be null for NO_CONTENT.
		if (serviceResponse.statusCode === 204) {
			res.status(204).send()
			return
		}
		res.status(serviceResponse.statusCode).send(serviceResponse)
	}
}

export const todoController = new TodoController()
