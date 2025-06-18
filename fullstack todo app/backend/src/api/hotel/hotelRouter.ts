import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi'
import express, { type Router } from 'express'
import { z } from 'zod'
import { StatusCodes } from 'http-status-codes'

import { createApiResponse } from '../../api-docs/openAPIResponseBuilders'

import { hotelController } from './hotelController'
import { AssignmentWithChargesSchema } from './hotelModel'

export const hotelRegistry = new OpenAPIRegistry()
export const hotelRouter: Router = express.Router()

hotelRegistry.register('AssignmentWithCharges', AssignmentWithChargesSchema)

// GET /hotel/products - Get hotel products with charges
hotelRegistry.registerPath({
    method: 'get',
    path: '/hotel/products',
    tags: ['Hotel'],
    responses: {
        ...createApiResponse(z.array(AssignmentWithChargesSchema), 'Hotel products retrieved successfully'),
        ...createApiResponse(
            z.object({ error: z.string(), message: z.string() }),
            'Failed to retrieve hotel products',
            StatusCodes.INTERNAL_SERVER_ERROR
        ),
    },
})
hotelRouter.get('/products', hotelController.getHotelProducts)
