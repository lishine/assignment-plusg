import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { StatusCodes } from 'http-status-codes'
import request from 'supertest'
import { readFileSync } from 'fs'

import { app } from '../../../server'

// Mock fs module
vi.mock('fs')

describe('Hotel API Endpoints', () => {
    const mockAssignmentData = [
        {
            id: '398555',
            reservation_uuid: '622e142c-594d-4624-97ca-0e7c019ba4cc',
            name: 'Dinner',
            extra_field: 'should be preserved',
        },
        {
            id: '398556',
            reservation_uuid: '622e142c-594d-4624-97ca-0e7c019ba4cc',
            name: 'Breakfast',
        },
        {
            id: '398468',
            reservation_uuid: '5b0d307d-0f4a-4b45-9596-b124f73d4d3d',
            name: 'Book Car Parking with Staycity',
        },
    ]

    const mockChargesData = [
        {
            special_product_assignment_id: '398555',
            active: true,
            amount: 2683.89,
        },
        {
            special_product_assignment_id: '398556',
            active: true,
            amount: 11240,
        },
        {
            special_product_assignment_id: '398556',
            active: true,
            amount: 11340,
        },
        {
            special_product_assignment_id: '398556',
            active: true,
            amount: 11440,
        },
        {
            special_product_assignment_id: '398556',
            active: true,
            amount: 11450,
        },
        {
            special_product_assignment_id: '398556',
            active: true,
            amount: 11460,
        },
        {
            special_product_assignment_id: '398556',
            active: true,
            amount: 11460,
        },
        {
            special_product_assignment_id: '398468',
            active: true,
            amount: 15,
        },
        {
            special_product_assignment_id: '999999',
            active: false,
            amount: 50,
        },
    ]

    beforeEach(() => {
        vi.clearAllMocks()
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    describe('GET /hotel/products', () => {
        it('should return hotel products with charges successfully', async () => {
            // Arrange
            const mockReadFileSync = vi.mocked(readFileSync)
            mockReadFileSync
                .mockReturnValueOnce(JSON.stringify(mockAssignmentData))
                .mockReturnValueOnce(JSON.stringify(mockChargesData))

            // Act
            const response = await request(app).get('/hotel/products')

            // Assert
            expect(response.statusCode).toBe(StatusCodes.OK)
            expect(response.body).toHaveLength(3)

            // Verify first product structure
            const firstProduct = response.body[0]
            expect(firstProduct).toEqual({
                id: '398555',
                reservation_uuid: '622e142c-594d-4624-97ca-0e7c019ba4cc',
                name: 'Dinner',
                product_charges: [
                    {
                        special_product_assignment_id: '398555',
                        active: true,
                        amount: 2683.89,
                    },
                ],
            })

            // Verify second product has correct charges
            const secondProduct = response.body[1]
            expect(secondProduct.id).toBe('398556')
            expect(secondProduct.product_charges).toHaveLength(6)
            expect(secondProduct.product_charges[0].amount).toBe(11240)

            // Verify third product has correct charges
            const thirdProduct = response.body[2]
            expect(thirdProduct.id).toBe('398468')
            expect(thirdProduct.product_charges).toHaveLength(1)
            expect(thirdProduct.product_charges[0].amount).toBe(15)

            // Verify readFileSync was called with correct paths
            expect(mockReadFileSync).toHaveBeenCalledTimes(2)
            expect(mockReadFileSync).toHaveBeenNthCalledWith(
                1,
                expect.stringContaining('product_assignment.json'),
                'utf8'
            )
            expect(mockReadFileSync).toHaveBeenNthCalledWith(2, expect.stringContaining('product_charges.json'), 'utf8')
        })

        it('should return products with empty charges array when no matching charges exist', async () => {
            // Arrange
            const assignmentWithoutCharges = [
                {
                    id: '999999',
                    reservation_uuid: 'test-uuid',
                    name: 'Product Without Charges',
                },
            ]
            const emptyCharges: any[] = []

            const mockReadFileSync = vi.mocked(readFileSync)
            mockReadFileSync
                .mockReturnValueOnce(JSON.stringify(assignmentWithoutCharges))
                .mockReturnValueOnce(JSON.stringify(emptyCharges))

            // Act
            const response = await request(app).get('/hotel/products')

            // Assert
            expect(response.statusCode).toBe(StatusCodes.OK)
            expect(response.body).toHaveLength(1)
            expect(response.body[0]).toEqual({
                id: '999999',
                reservation_uuid: 'test-uuid',
                name: 'Product Without Charges',
                product_charges: [],
            })
        })

        it('should limit results to first 10 assignments', async () => {
            // Arrange
            const manyAssignments = Array.from({ length: 15 }, (_, index) => ({
                id: `${index + 1}`,
                reservation_uuid: `uuid-${index + 1}`,
                name: `Product ${index + 1}`,
            }))

            const mockReadFileSync = vi.mocked(readFileSync)
            mockReadFileSync
                .mockReturnValueOnce(JSON.stringify(manyAssignments))
                .mockReturnValueOnce(JSON.stringify([]))

            // Act
            const response = await request(app).get('/hotel/products')

            // Assert
            expect(response.statusCode).toBe(StatusCodes.OK)
            expect(response.body).toHaveLength(10)
            expect(response.body[0].id).toBe('1')
            expect(response.body[9].id).toBe('10')
        })

        it('should return empty array when no assignments exist', async () => {
            // Arrange
            const mockReadFileSync = vi.mocked(readFileSync)
            mockReadFileSync.mockReturnValueOnce(JSON.stringify([])).mockReturnValueOnce(JSON.stringify([]))

            // Act
            const response = await request(app).get('/hotel/products')

            // Assert
            expect(response.statusCode).toBe(StatusCodes.OK)
            expect(response.body).toEqual([])
        })

        it('should handle invalid JSON in assignment file', async () => {
            // Arrange
            const mockReadFileSync = vi.mocked(readFileSync)
            mockReadFileSync.mockReturnValueOnce('invalid json')

            // Act
            const response = await request(app).get('/hotel/products')

            // Assert
            expect(response.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
            expect(response.body).toEqual({
                error: 'Failed to retrieve hotel products',
                message: expect.stringContaining('Unexpected token'),
            })
        })

        it('should handle invalid JSON in charges file', async () => {
            // Arrange
            const mockReadFileSync = vi.mocked(readFileSync)
            mockReadFileSync.mockReturnValueOnce(JSON.stringify(mockAssignmentData)).mockReturnValueOnce('invalid json')

            // Act
            const response = await request(app).get('/hotel/products')

            // Assert
            expect(response.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
            expect(response.body).toEqual({
                error: 'Failed to retrieve hotel products',
                message: expect.stringContaining('Unexpected token'),
            })
        })

        it('should handle file read errors', async () => {
            // Arrange
            const mockReadFileSync = vi.mocked(readFileSync)
            mockReadFileSync.mockImplementation(() => {
                throw new Error('File not found')
            })

            // Act
            const response = await request(app).get('/hotel/products')

            // Assert
            expect(response.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
            expect(response.body).toEqual({
                error: 'Failed to retrieve hotel products',
                message: 'File not found',
            })
        })

        it('should handle non-Error exceptions', async () => {
            // Arrange
            const mockReadFileSync = vi.mocked(readFileSync)
            mockReadFileSync.mockImplementation(() => {
                throw 'String error'
            })

            // Act
            const response = await request(app).get('/hotel/products')

            // Assert
            expect(response.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
            expect(response.body).toEqual({
                error: 'Failed to retrieve hotel products',
                message: 'Unknown error',
            })
        })

        it('should correctly filter charges by assignment id', async () => {
            // Arrange
            const assignments = [
                { id: 'A1', reservation_uuid: 'uuid1', name: 'Assignment 1' },
                { id: 'A2', reservation_uuid: 'uuid2', name: 'Assignment 2' },
            ]

            const charges = [
                { special_product_assignment_id: 'A1', amount: 100 },
                { special_product_assignment_id: 'A1', amount: 200 },
                { special_product_assignment_id: 'A2', amount: 300 },
                { special_product_assignment_id: 'A3', amount: 400 }, // Should not appear
            ]

            const mockReadFileSync = vi.mocked(readFileSync)
            mockReadFileSync
                .mockReturnValueOnce(JSON.stringify(assignments))
                .mockReturnValueOnce(JSON.stringify(charges))

            // Act
            const response = await request(app).get('/hotel/products')

            // Assert
            expect(response.statusCode).toBe(StatusCodes.OK)
            expect(response.body).toHaveLength(2)

            // First assignment should have 2 charges
            expect(response.body[0].id).toBe('A1')
            expect(response.body[0].product_charges).toHaveLength(2)
            expect(response.body[0].product_charges[0].amount).toBe(100)
            expect(response.body[0].product_charges[1].amount).toBe(200)

            // Second assignment should have 1 charge
            expect(response.body[1].id).toBe('A2')
            expect(response.body[1].product_charges).toHaveLength(1)
            expect(response.body[1].product_charges[0].amount).toBe(300)
        })

        it('should preserve only required fields from assignments', async () => {
            // Arrange
            const assignmentWithExtraFields = [
                {
                    id: '123',
                    reservation_uuid: 'test-uuid',
                    name: 'Test Product',
                    extra_field1: 'should not appear',
                    extra_field2: 'should not appear',
                    description: 'should not appear',
                },
            ]

            const mockReadFileSync = vi.mocked(readFileSync)
            mockReadFileSync
                .mockReturnValueOnce(JSON.stringify(assignmentWithExtraFields))
                .mockReturnValueOnce(JSON.stringify([]))

            // Act
            const response = await request(app).get('/hotel/products')

            // Assert
            expect(response.statusCode).toBe(StatusCodes.OK)
            expect(response.body[0]).toEqual({
                id: '123',
                reservation_uuid: 'test-uuid',
                name: 'Test Product',
                product_charges: [],
            })
            expect(response.body[0]).not.toHaveProperty('extra_field1')
            expect(response.body[0]).not.toHaveProperty('extra_field2')
            expect(response.body[0]).not.toHaveProperty('description')
        })
    })
})
