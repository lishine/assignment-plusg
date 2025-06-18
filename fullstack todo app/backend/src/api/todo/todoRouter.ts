import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi'
import express, { type Router } from 'express'
import { z } from 'zod'
import { StatusCodes } from 'http-status-codes'

import { createApiResponse } from '../../api-docs/openAPIResponseBuilders'
import { validateRequest } from '../../common/utils/httpHandlers'

import { todoController } from './todoController'
import { CreateTodoSchema, TodoSchema, UpdateTodoSchema, TodoPathParamsSchema } from './todoModel'

export const todoRegistry = new OpenAPIRegistry()
export const todoRouter: Router = express.Router()

todoRegistry.register('Todo', TodoSchema)

// POST /todos - Create a new ToDo item
todoRegistry.registerPath({
    method: 'post',
    path: '/todos',
    tags: ['ToDo'],
    request: {
        body: {
            content: {
                'application/json': {
                    schema: CreateTodoSchema,
                },
            },
        },
    },
    responses: {
        ...createApiResponse(TodoSchema, 'ToDo item created successfully', StatusCodes.CREATED),
        ...createApiResponse(
            z.object({ message: z.string(), errors: z.any().optional() }),
            'Invalid request body',
            StatusCodes.BAD_REQUEST
        ),
    },
})
todoRouter.post('/', validateRequest(z.object({ body: CreateTodoSchema })), todoController.createTodo)

// GET /todos - Get all ToDo items
todoRegistry.registerPath({
    method: 'get',
    path: '/todos',
    tags: ['ToDo'],
    responses: createApiResponse(z.array(TodoSchema), 'ToDo items retrieved successfully'),
})
todoRouter.get('/', todoController.getTodos)

// GET /todos/:id - Get a specific ToDo item
todoRegistry.registerPath({
    method: 'get',
    path: '/todos/{id}',
    tags: ['ToDo'],
    request: { params: TodoPathParamsSchema.shape.params },
    responses: {
        ...createApiResponse(TodoSchema, 'ToDo item retrieved successfully'),
        ...createApiResponse(z.null(), 'ToDo item not found', StatusCodes.NOT_FOUND),
    },
})
todoRouter.get('/:id', validateRequest(TodoPathParamsSchema), todoController.getTodoById)

// PUT /todos/:id - Update a ToDo item
todoRegistry.registerPath({
    method: 'put',
    path: '/todos/{id}',
    tags: ['ToDo'],
    request: {
        params: TodoPathParamsSchema.shape.params,
        body: {
            content: {
                'application/json': {
                    schema: UpdateTodoSchema,
                },
            },
        },
    },
    responses: {
        ...createApiResponse(TodoSchema, 'ToDo item updated successfully'),
        ...createApiResponse(
            z.object({ message: z.string(), errors: z.any().optional() }),
            'Invalid request body',
            StatusCodes.BAD_REQUEST
        ),
        ...createApiResponse(z.null(), 'ToDo item not found', StatusCodes.NOT_FOUND),
    },
})
todoRouter.put(
    '/:id',
    validateRequest(z.object({ params: TodoPathParamsSchema.shape.params, body: UpdateTodoSchema })),
    todoController.updateTodo
)

// DELETE /todos/:id - Remove a ToDo item
todoRegistry.registerPath({
    method: 'delete',
    path: '/todos/{id}',
    tags: ['ToDo'],
    request: { params: TodoPathParamsSchema.shape.params },
    responses: {
        ...createApiResponse(z.null(), 'ToDo item deleted successfully', StatusCodes.NO_CONTENT),
        ...createApiResponse(z.null(), 'ToDo item not found', StatusCodes.NOT_FOUND),
    },
})
todoRouter.delete('/:id', validateRequest(TodoPathParamsSchema), todoController.deleteTodo)
