import React from 'react'
import ProductRow from './ProductRow'
import type { AssignmentWithCharges } from '../../../types/hotel.types'

interface ProductsTableProps {
    products: AssignmentWithCharges[]
}

const ProductsTable: React.FC<ProductsTableProps> = ({ products }) => {
    return (
        <table className="products-table">
            <thead>
                <tr>
                    <th>Product Name</th>
                    <th>Status</th>
                    <th>Charge</th>
                </tr>
            </thead>
            <tbody>
                {products.map((product) =>
                    product.product_charges.map((charge) => (
                        <ProductRow
                            key={`${product.id}-${charge.special_product_assignment_id}`}
                            productName={product.name}
                            charge={charge}
                            productId={product.id}
                        />
                    ))
                )}
            </tbody>
        </table>
    )
}

export default ProductsTable
