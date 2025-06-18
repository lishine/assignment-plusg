import { useZustandCreate } from '../../utils/useZustandCreate'
import type { AssignmentWithCharges, ReservationGroup } from '../../types/hotel.types'
import { hotelApiService } from '../../services/hotelApiService'

type HotelState = {
    products: AssignmentWithCharges[]
    isLoading: boolean
    error: string | null
    groupedReservations: ReservationGroup[]
    fetchHotelProducts: () => Promise<void>
}

export const useAccessHotelStore = () => {
    const useHotelStore = useZustandCreate<HotelState>('hotelStore', (set, get) => {
        const computeGroupedReservations = (products: AssignmentWithCharges[]): ReservationGroup[] => {
            return products.reduce((acc: ReservationGroup[], product) => {
                const existingGroup = acc.find((group) => group.reservation_uuid === product.reservation_uuid)

                const activeCharges = product.product_charges.filter((charge) => charge.active)
                const activeCount = activeCharges.length
                const totalActiveAmount = activeCharges.reduce((sum, charge) => sum + charge.amount, 0)

                if (existingGroup) {
                    existingGroup.products.push(product)
                    existingGroup.activeCount += activeCount
                    existingGroup.totalActiveAmount += totalActiveAmount
                } else {
                    acc.push({
                        reservation_uuid: product.reservation_uuid,
                        products: [product],
                        activeCount,
                        totalActiveAmount,
                    })
                }

                return acc
            }, [])
        }

        return {
            products: [],
            isLoading: false,
            error: null,
            groupedReservations: [],

            fetchHotelProducts: async () => {
                set({ isLoading: true, error: null })
                try {
                    const products = await hotelApiService.fetchHotelProducts()
                    const groupedReservations = computeGroupedReservations(products)
                    set({ products, groupedReservations, isLoading: false })
                } catch (err) {
                    set({ error: (err as Error).message || 'Failed to fetch hotel products', isLoading: false })
                }
            },
        }
    })
    return { useHotelStore }
}
