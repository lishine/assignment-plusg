import { describe, it, expect, vi, beforeEach } from 'vitest'
import { StatusCodes } from 'http-status-codes'

import { HotelService } from '../hotelService'

const mockRepository = {
    findProductAssignments: vi.fn(),
    findProductCharges: vi.fn(),
}

describe('HotelService', () => {
    let hotelService: HotelService

    beforeEach(() => {
        vi.clearAllMocks()
        hotelService = new HotelService(mockRepository)
    })

    describe('getHotelProducts', () => {
        const mockAssignmentData = [
            {
                id: '398555',
                reservation_uuid: '622e142c-594d-4624-97ca-0e7c019ba4cc',
                name: 'Dinner',
            },
            {
                id: '398556',
                reservation_uuid: '622e142c-594d-4624-97ca-0e7c019ba4cc',
                name: 'Breakfast',
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
                amount: 1140,
            },
        ]

        it('should return hotel products with charges successfully', async () => {
            mockRepository.findProductAssignments.mockResolvedValue(mockAssignmentData)
            mockRepository.findProductCharges.mockResolvedValue(mockChargesData)

            const result = await hotelService.getHotelProducts()

            expect(result.success).toBe(true)
            expect(result.statusCode).toBe(StatusCodes.OK)
            expect(result.message).toBe('Hotel products retrieved successfully')
            expect(result.responseObject).toHaveLength(2)
            expect(result.responseObject![0]).toEqual({
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
        })

        it('should limit results to first 10 assignments', async () => {
            const manyAssignments = Array.from({ length: 15 }, (_, index) => ({
                id: `${index + 1}`,
                reservation_uuid: `uuid-${index + 1}`,
                name: `Product ${index + 1}`,
            }))

            mockRepository.findProductAssignments.mockResolvedValue(manyAssignments)
            mockRepository.findProductCharges.mockResolvedValue([])

            const result = await hotelService.getHotelProducts()

            expect(result.success).toBe(true)
            expect(result.responseObject).toHaveLength(10)
        })

        it('should return products with empty charges array when no matching charges exist', async () => {
            const assignmentWithoutCharges = [
                {
                    id: '999999',
                    reservation_uuid: 'test-uuid',
                    name: 'Product Without Charges',
                },
            ]

            mockRepository.findProductAssignments.mockResolvedValue(assignmentWithoutCharges)
            mockRepository.findProductCharges.mockResolvedValue([])

            const result = await hotelService.getHotelProducts()

            expect(result.success).toBe(true)
            expect(result.responseObject![0]).toEqual({
                id: '999999',
                reservation_uuid: 'test-uuid',
                name: 'Product Without Charges',
                product_charges: [],
            })
        })

        it('should handle repository errors', async () => {
            const error = new Error('Repository error')
            mockRepository.findProductAssignments.mockRejectedValue(error)

            const result = await hotelService.getHotelProducts()

            expect(result.success).toBe(false)
            expect(result.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
            expect(result.message).toBe('Failed to retrieve hotel products')
        })

        it('should correctly filter charges by assignment id', async () => {
            const assignments = [
                { id: 'A1', reservation_uuid: 'uuid1', name: 'Assignment 1' },
                { id: 'A2', reservation_uuid: 'uuid2', name: 'Assignment 2' },
            ]

            const charges = [
                { special_product_assignment_id: 'A1', amount: 100 },
                { special_product_assignment_id: 'A1', amount: 200 },
                { special_product_assignment_id: 'A2', amount: 300 },
                { special_product_assignment_id: 'A3', amount: 400 },
            ]

            mockRepository.findProductAssignments.mockResolvedValue(assignments)
            mockRepository.findProductCharges.mockResolvedValue(charges)

            const result = await hotelService.getHotelProducts()

            expect(result.success).toBe(true)
            expect(result.responseObject![0].product_charges).toHaveLength(2)
            expect(result.responseObject![1].product_charges).toHaveLength(1)
        })
    })
})
