import { readFileSync } from 'fs'
import { join } from 'path'

import { ProductAssignment, ProductCharge } from './hotelModel'

export const hotelRepository = {
    async findProductAssignments(): Promise<ProductAssignment[]> {
        const assignmentPath = join(__dirname, '../../product_assignment.json')
        const assignmentData: ProductAssignment[] = JSON.parse(readFileSync(assignmentPath, 'utf8'))
        return assignmentData
    },

    async findProductCharges(): Promise<ProductCharge[]> {
        const chargesPath = join(__dirname, '../../product_charges.json')
        const chargesData: ProductCharge[] = JSON.parse(readFileSync(chargesPath, 'utf8'))
        return chargesData
    },
}
