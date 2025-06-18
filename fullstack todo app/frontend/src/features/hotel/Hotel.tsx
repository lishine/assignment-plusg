import { FetchError, ofetch } from 'ofetch'
import { useEffect, useState } from 'react'

interface ProductAssignment {
    id: string
    reservation_uuid: string
    name: string
}

interface ProductCharge {
    special_product_assignment_id: string
}

interface AssignmentWithCharges extends ProductAssignment {
    product_charges: ProductCharge[]
}
const API_BASE_URL = 'http://localhost:8080' // Adjust this to your actual API base URL

const Hotel = () => {
    const [products, setProducts] = useState<AssignmentWithCharges[]>([])

    useEffect(() => {
        const fetchProducts = async (): Promise<AssignmentWithCharges[]> => {
            try {
                const assignmentCharges = await ofetch<AssignmentWithCharges[]>('/hotel/products', {
                    baseURL: API_BASE_URL,
                })
                if (assignmentCharges && Array.isArray(assignmentCharges)) {
                    return assignmentCharges
                } else {
                    throw new Error('Failed to fetch products but API reported success.')
                }
            } catch (error: unknown) {
                if (error instanceof FetchError && error.data) {
                    throw error.data // This is the ServiceResponse from the backend on HTTP error
                }
                throw error // For other unexpected errors
            }
        }
        fetchProducts()
            .then((data) => {
                setProducts(data)
            })
            .catch((error) => {
                console.error('Error fetching products:', error)
            })
    }, [])

    return (
        <>
            <div className="todos-container">
                <h1>Hotel</h1>
                <ul>
                    {products.map((product) => (
                        <li key={product.id}>
                            <h2>{product.name}</h2>
                            <p>Reservation ID: {product.reservation_uuid}</p>
                            <h3>Product Charges:</h3>
                            <ul>
                                {product.product_charges.map((charge) => (
                                    <li key={charge.special_product_assignment_id}>
                                        Charge ID: {charge.special_product_assignment_id}
                                    </li>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ul>
            </div>
            <style jsx>{`
                .todos-container {
                    max-width: 600px;
                    margin: 20px auto;
                    padding: 20px;
                    font-family: Arial, sans-serif;
                    border: 1px solid #eee;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }
                h1 {
                    text-align: center;
                    color: #333;
                }
                .todo-list {
                    margin-top: 20px;
                }
                p {
                    text-align: center;
                    color: #666;
                }
            `}</style>
        </>
    )
}

export default Hotel
