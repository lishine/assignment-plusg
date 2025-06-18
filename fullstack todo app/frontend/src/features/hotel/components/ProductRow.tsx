import React from 'react'
import type { ProductCharge } from '../../../types/hotel.types'

interface ProductRowProps {
    productName: string
    charge: ProductCharge
    productId: string
}

const ProductRow: React.FC<ProductRowProps> = ({ productName, charge, productId }) => {
    return (
        <tr key={`${productId}-${charge.special_product_assignment_id}`}>
            <td>{productName}</td>
            <td>
                <span className={`status ${charge.active ? 'active' : 'inactive'}`}>
                    {charge.active ? 'Active' : 'Inactive'}
                </span>
            </td>
            <td>${charge.amount.toFixed(2)}</td>
        </tr>
    )
}

export default ProductRow
