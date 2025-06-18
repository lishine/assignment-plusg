import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'
import { z } from 'zod'

extendZodWithOpenApi(z)

export const TodoIdSchema = z.string().uuid({ message: 'ID must be a valid UUID' })

export const TodoSchema = z.object({
	id: TodoIdSchema,
	text: z.string().min(1, { message: 'Text cannot be empty' }),
	isDone: z.boolean().default(false),
	createdAt: z.date(),
	updatedAt: z.date(),
})

export type Todo = z.infer<typeof TodoSchema>

// Schema for creating a new ToDo item (omits id, createdAt, updatedAt as they are auto-generated)
export const CreateTodoSchema = TodoSchema.omit({ id: true, createdAt: true, updatedAt: true })
export type CreateTodoDto = z.infer<typeof CreateTodoSchema>

// Schema for updating an existing ToDo item (all fields optional, id is in params)
export const UpdateTodoSchema = TodoSchema.pick({ text: true, isDone: true }).partial()
export type UpdateTodoDto = z.infer<typeof UpdateTodoSchema>

// Schema for validating ID in params for GET, PUT, DELETE requests
export const TodoPathParamsSchema = z.object({
	params: z.object({ id: TodoIdSchema }),
})
