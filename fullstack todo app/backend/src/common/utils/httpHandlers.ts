import type { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import type { ZodError, ZodSchema } from 'zod'

import { ServiceResponse } from '../models/serviceResponse'

export const validateRequest = (schema: ZodSchema) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			await schema.parseAsync({ body: req.body, query: req.query, params: req.params })
			next()
		} catch (err) {
			const errorMessage = `Invalid input: ${(err as ZodError).errors
				.map((e) => {
					return e.message
				})
				.join(', ')}`
			const statusCode = StatusCodes.BAD_REQUEST
			const serviceResponse = ServiceResponse.failure(errorMessage, null, statusCode)
			res.status(serviceResponse.statusCode).send(serviceResponse)
		}
	}
}
