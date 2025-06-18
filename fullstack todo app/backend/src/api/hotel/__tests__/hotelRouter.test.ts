import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { StatusCodes } from 'http-status-codes'
import request from 'supertest'

import { app } from '../../../server'
import { hotelRepository } from '../hotelRepository'

// Mock the hotel repository
vi.mock('../hotelRepository')

const mockHotelRepository = vi.mocked(hotelRepository)

describe('Hotel API', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    describe('GET /hotel', () => {
        it('should return hotel products successfully', async () => {
            // Mock repository responses
            mockHotelRepository.findProductAssignments.mockResolvedValue([
                {
                    id: '1',
                    reservation_uuid: '123e4567-e89b-12d3-a456-426614174000',
                    name: 'Hotel Room 1',
                },
                {
                    id: '2',
                    reservation_uuid: '123e4567-e89b-12d3-a456-426614174001',
                    name: 'Hotel Room 2',
                },
            ])

            mockHotelRepository.findProductCharges.mockResolvedValue([
                {
                    special_product_assignment_id: '1',
                    amount: 20,
                    active: true,
                },
                {
                    special_product_assignment_id: '2',
                    amount: 10,
                    active: true,
                },
            ])

            const response = await request(app).get('/hotel/products')

            expect(response.status).toBe(StatusCodes.OK)
            expect(response.body).toEqual({
                success: true,
                message: 'Hotel products retrieved successfully',
                responseObject: [
                    {
                        id: '1',
                        reservation_uuid: '123e4567-e89b-12d3-a456-426614174000',
                        name: 'Hotel Room 1',
                        product_charges: [
                            {
                                special_product_assignment_id: '1',
                                amount: 20,
                                active: true,
                            },
                        ],
                    },
                    {
                        id: '2',
                        reservation_uuid: '123e4567-e89b-12d3-a456-426614174001',
                        name: 'Hotel Room 2',
                        product_charges: [
                            {
                                special_product_assignment_id: '2',
                                amount: 10,
                                active: true,
                            },
                        ],
                    },
                ],
                statusCode: 200,
            })
        })

        it('should return empty array when no assignments found', async () => {
            mockHotelRepository.findProductAssignments.mockResolvedValue([])
            mockHotelRepository.findProductCharges.mockResolvedValue([])

            const response = await request(app).get('/hotel/products')

            expect(response.status).toBe(StatusCodes.OK)
            expect(response.body).toEqual({
                success: true,
                message: 'Hotel products retrieved successfully',
                responseObject: [],
                statusCode: 200,
            })
        })

        it('should return assignments without charges when no charges found', async () => {
            mockHotelRepository.findProductAssignments.mockResolvedValue([
                {
                    id: '1',
                    reservation_uuid: '123e4567-e89b-12d3-a456-426614174000',
                    name: 'Hotel Room 1',
                },
            ])
            mockHotelRepository.findProductCharges.mockResolvedValue([])

            const response = await request(app).get('/hotel/products')

            expect(response.status).toBe(StatusCodes.OK)
            expect(response.body).toEqual({
                success: true,
                message: 'Hotel products retrieved successfully',
                responseObject: [
                    {
                        id: '1',
                        reservation_uuid: '123e4567-e89b-12d3-a456-426614174000',
                        name: 'Hotel Room 1',
                        product_charges: [],
                    },
                ],
                statusCode: 200,
            })
        })

        it('should limit results to first 10 items', async () => {
            const assignments = Array.from({ length: 15 }, (_, i) => ({
                id: `${i + 1}`,
                reservation_uuid: `123e4567-e89b-12d3-a456-42661417400${i}`,
                name: `Hotel Room ${i + 1}`,
            }))

            mockHotelRepository.findProductAssignments.mockResolvedValue(assignments)
            mockHotelRepository.findProductCharges.mockResolvedValue([])

            const response = await request(app).get('/hotel/products')

            expect(response.status).toBe(StatusCodes.OK)
            expect(response.body.success).toBe(true)
            expect(response.body.message).toBe('Hotel products retrieved successfully')
            expect(response.body.responseObject).toHaveLength(10)
            expect(response.body.responseObject[0].id).toBe('1')
            expect(response.body.responseObject[9].id).toBe('10')
            expect(response.body.statusCode).toBe(200)
        })

        it('should handle repository error for assignments', async () => {
            mockHotelRepository.findProductAssignments.mockRejectedValue(new Error('File not found'))
            mockHotelRepository.findProductCharges.mockResolvedValue([])

            const response = await request(app).get('/hotel/products')

            expect(response.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
            expect(response.body).toEqual({
                success: false,
                message: 'Failed to retrieve hotel products',
                responseObject: null,
                statusCode: 500,
            })
        })

        it('should handle repository error for charges', async () => {
            mockHotelRepository.findProductAssignments.mockResolvedValue([
                {
                    id: '1',
                    reservation_uuid: '123e4567-e89b-12d3-a456-426614174000',
                    name: 'Hotel Room 1',
                },
            ])
            mockHotelRepository.findProductCharges.mockRejectedValue(new Error('File not found'))

            const response = await request(app).get('/hotel/products')

            expect(response.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
            expect(response.body).toEqual({
                success: false,
                message: 'Failed to retrieve hotel products',
                responseObject: null,
                statusCode: 500,
            })
        })

        it('should handle invalid JSON in assignments', async () => {
            mockHotelRepository.findProductAssignments.mockRejectedValue(new SyntaxError('Unexpected token'))
            mockHotelRepository.findProductCharges.mockResolvedValue([])

            const response = await request(app).get('/hotel/products')

            expect(response.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
            expect(response.body).toEqual({
                success: false,
                message: 'Failed to retrieve hotel products',
                responseObject: null,
                statusCode: 500,
            })
        })

        it('should handle invalid JSON in charges', async () => {
            mockHotelRepository.findProductAssignments.mockResolvedValue([
                {
                    id: '1',
                    reservation_uuid: '123e4567-e89b-12d3-a456-426614174000',
                    name: 'Hotel Room 1',
                },
            ])
            mockHotelRepository.findProductCharges.mockRejectedValue(new SyntaxError('Unexpected token'))

            const response = await request(app).get('/hotel/products')

            expect(response.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
            expect(response.body).toEqual({
                success: false,
                message: 'Failed to retrieve hotel products',
                responseObject: null,
                statusCode: 500,
            })
        })

        it('should match charges to correct products', async () => {
            mockHotelRepository.findProductAssignments.mockResolvedValue([
                {
                    id: '1',
                    reservation_uuid: '123e4567-e89b-12d3-a456-426614174000',
                    name: 'Hotel Room 1',
                },
                {
                    id: '2',
                    reservation_uuid: '123e4567-e89b-12d3-a456-426614174001',
                    name: 'Hotel Room 2',
                },
            ])

            mockHotelRepository.findProductCharges.mockResolvedValue([
                {
                    special_product_assignment_id: '1',
                    amount: 20,
                    active: true,
                },
                {
                    special_product_assignment_id: '1',
                    amount: 15,
                    active: true,
                },
                {
                    special_product_assignment_id: '3', // Non-existent product
                    amount: 5,
                    active: true,
                },
            ])

            const response = await request(app).get('/hotel/products')

            expect(response.status).toBe(StatusCodes.OK)
            expect(response.body).toEqual({
                success: true,
                message: 'Hotel products retrieved successfully',
                responseObject: [
                    {
                        id: '1',
                        reservation_uuid: '123e4567-e89b-12d3-a456-426614174000',
                        name: 'Hotel Room 1',
                        product_charges: [
                            {
                                special_product_assignment_id: '1',
                                amount: 20,
                                active: true,
                            },
                            {
                                special_product_assignment_id: '1',
                                amount: 15,
                                active: true,
                            },
                        ],
                    },
                    {
                        id: '2',
                        reservation_uuid: '123e4567-e89b-12d3-a456-426614174001',
                        name: 'Hotel Room 2',
                        product_charges: [],
                    },
                ],
                statusCode: 200,
            })
        })

        it('should handle mixed data types gracefully', async () => {
            mockHotelRepository.findProductAssignments.mockResolvedValue([
                {
                    id: '1',
                    reservation_uuid: '123e4567-e89b-12d3-a456-426614174000',
                    name: 'Hotel Room 1',
                },
            ])

            mockHotelRepository.findProductCharges.mockResolvedValue([
                {
                    special_product_assignment_id: '1',
                    amount: 20,
                    active: true,
                },
            ])

            const response = await request(app).get('/hotel/products')

            expect(response.status).toBe(StatusCodes.OK)
            expect(response.body).toEqual({
                success: true,
                message: 'Hotel products retrieved successfully',
                responseObject: [
                    {
                        id: '1',
                        reservation_uuid: '123e4567-e89b-12d3-a456-426614174000',
                        name: 'Hotel Room 1',
                        product_charges: [
                            {
                                special_product_assignment_id: '1',
                                amount: 20,
                                active: true,
                            },
                        ],
                    },
                ],
                statusCode: 200,
            })
        })
    })
})
