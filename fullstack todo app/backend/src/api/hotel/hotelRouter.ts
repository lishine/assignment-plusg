import express, { type Router } from 'express'
import { readFileSync } from 'fs'
import { join } from 'path'

export const hotelRouter: Router = express.Router()

interface ProductAssignment {
    id: string
    reservation_uuid: string
    name: string
    [key: string]: any
}

interface ProductCharge {
    special_product_assignment_id: string
    [key: string]: any
}

interface AssignmentWithCharges extends ProductAssignment {
    product_charges: ProductCharge[]
}

hotelRouter.get('/products', (req, res) => {
    try {
        const assignmentPath = join(__dirname, '../../product_assignment.json')
        const chargesPath = join(__dirname, '../../product_charges.json')

        const assignmentData: ProductAssignment[] = JSON.parse(readFileSync(assignmentPath, 'utf8'))
        const chargesData: ProductCharge[] = JSON.parse(readFileSync(chargesPath, 'utf8'))

        const result: AssignmentWithCharges[] = assignmentData.slice(0, 10).map((assignment) => ({
            id: assignment.id,
            reservation_uuid: assignment.reservation_uuid,
            name: assignment.name,
            product_charges: chargesData.filter((charge) => charge.special_product_assignment_id === assignment.id),
        }))

        res.status(200).json(result)
    } catch (error) {
        console.error('Error processing hotel products:', error)
        res.status(500).json({
            error: 'Failed to retrieve hotel products',
            message: error instanceof Error ? error.message : 'Unknown error',
        })
    }
})
