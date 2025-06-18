import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'
import { z } from 'zod'

extendZodWithOpenApi(z)

export const ProductAssignmentSchema = z.object({
    id: z.string(),
    reservation_uuid: z.string().uuid({ message: 'Reservation UUID must be a valid UUID' }),
    name: z.string().min(1, { message: 'Name cannot be empty' }),
})

export type ProductAssignment = z.infer<typeof ProductAssignmentSchema>

export const ProductChargeSchema = z.object({
    special_product_assignment_id: z.string(),
    active: z.boolean().optional(),
    amount: z.number(),
})

export type ProductCharge = z.infer<typeof ProductChargeSchema>

export const AssignmentWithChargesSchema = z.object({
    id: z.string(),
    reservation_uuid: z.string().uuid(),
    name: z.string(),
    product_charges: z.array(ProductChargeSchema),
})

export type AssignmentWithCharges = z.infer<typeof AssignmentWithChargesSchema>
