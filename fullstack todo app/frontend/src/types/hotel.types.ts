export interface ProductAssignment {
    id: string
    reservation_uuid: string
    name: string
}

export interface ProductCharge {
    special_product_assignment_id: string
    active: boolean
    amount: number
}

export interface AssignmentWithCharges extends ProductAssignment {
    product_charges: ProductCharge[]
}

export interface ReservationGroup {
    reservation_uuid: string
    products: AssignmentWithCharges[]
    activeCount: number
    totalActiveAmount: number
}

export interface ServiceResponse<T = unknown> {
    success: boolean
    message: string
    responseObject: T
    statusCode: number
}
