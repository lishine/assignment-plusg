import { ofetch, FetchError } from 'ofetch'
import type { AssignmentWithCharges, ServiceResponse } from '../types/hotel.types'

const API_BASE_URL = 'http://localhost:8080'

export const hotelApiService = {
    fetchHotelProducts: async (): Promise<AssignmentWithCharges[]> => {
        try {
            const serviceResponse = await ofetch<ServiceResponse<AssignmentWithCharges[]>>('/hotel/products', {
                baseURL: API_BASE_URL,
            })
            if (serviceResponse.success && serviceResponse.responseObject !== undefined) {
                return serviceResponse.responseObject
            } else {
                throw new Error(serviceResponse.message || 'Failed to fetch hotel products but API reported success.')
            }
        } catch (error: unknown) {
            if (error instanceof FetchError && error.data) {
                throw error.data
            }
            throw error
        }
    },
}
