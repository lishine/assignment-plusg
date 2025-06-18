import { StatusCodes } from 'http-status-codes'

import { ServiceResponse } from '../../common/models/serviceResponse'
import { logger } from '../../server'

import { AssignmentWithCharges } from './hotelModel'
import { hotelRepository } from './hotelRepository'

export class HotelService {
    private repository: typeof hotelRepository

    constructor(repository: typeof hotelRepository = hotelRepository) {
        this.repository = repository
    }

    async getHotelProducts(): Promise<ServiceResponse<AssignmentWithCharges[] | null>> {
        try {
            const assignmentData = await this.repository.findProductAssignments()
            const chargesData = await this.repository.findProductCharges()

            const result: AssignmentWithCharges[] = assignmentData.slice(0, 10).map((assignment) => ({
                id: assignment.id,
                reservation_uuid: assignment.reservation_uuid,
                name: assignment.name,
                product_charges: chargesData.filter((charge) => charge.special_product_assignment_id === assignment.id),
            }))

            return ServiceResponse.success<AssignmentWithCharges[]>('Hotel products retrieved successfully', result)
        } catch (ex) {
            const errorMessage = `Error processing hotel products: ${(ex as Error).message}`
            logger.error(errorMessage)
            return ServiceResponse.failure('Failed to retrieve hotel products', null, StatusCodes.INTERNAL_SERVER_ERROR)
        }
    }
}

export const hotelService = new HotelService()
