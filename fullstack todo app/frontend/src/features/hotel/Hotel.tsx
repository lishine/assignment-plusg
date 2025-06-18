import { FetchError, ofetch } from 'ofetch'
import { useCallback, useEffect, useMemo, useState } from 'react'

interface ProductAssignment {
    id: string
    reservation_uuid: string
    name: string
}

interface ProductCharge {
    special_product_assignment_id: string
    active: boolean
    amount: number
}

interface AssignmentWithCharges extends ProductAssignment {
    product_charges: ProductCharge[]
}

interface ReservationGroup {
    reservation_uuid: string
    products: AssignmentWithCharges[]
    activeCount: number
    totalActiveAmount: number
}

const API_BASE_URL = 'http://localhost:8080'

const Hotel = () => {
    const [products, setProducts] = useState<AssignmentWithCharges[]>([])
    const [expandedReservations, setExpandedReservations] = useState<Set<string>>(new Set())

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
                    throw error.data
                }
                throw error
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

    const groupedReservations: ReservationGroup[] = useMemo(
        () =>
            products.reduce((acc: ReservationGroup[], product) => {
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
            }, []),
        [products]
    )

    const toggleReservation = useCallback(
        (reservationUuid: string) => {
            const newExpanded = new Set(expandedReservations)
            if (newExpanded.has(reservationUuid)) {
                newExpanded.delete(reservationUuid)
            } else {
                newExpanded.add(reservationUuid)
            }
            setExpandedReservations(newExpanded)
        },
        [expandedReservations]
    )

    return (
        <>
            <div className="hotel-container">
                <h1>Hotel Reservations</h1>
                <table className="reservations-table">
                    <thead>
                        <tr>
                            <th>Reservation UUID</th>
                            <th>Number of Active Purchases</th>
                            <th>Sum of Active Charges</th>
                        </tr>
                    </thead>
                    <tbody>
                        {groupedReservations.map((reservation) => (
                            <>
                                <tr
                                    key={reservation.reservation_uuid}
                                    className="main-row"
                                    onClick={() => toggleReservation(reservation.reservation_uuid)}
                                >
                                    <td>
                                        <span className="expand-indicator">
                                            {expandedReservations.has(reservation.reservation_uuid) ? 'V' : '>'}
                                        </span>
                                        {reservation.reservation_uuid}
                                    </td>
                                    <td>{reservation.activeCount}</td>
                                    <td>${reservation.totalActiveAmount.toFixed(2)}</td>
                                </tr>
                                {expandedReservations.has(reservation.reservation_uuid) && (
                                    <>
                                        <tr className="sub-header">
                                            <td colSpan={3}>
                                                <table className="products-table">
                                                    <thead>
                                                        <tr>
                                                            <th>Product Name</th>
                                                            <th>Status</th>
                                                            <th>Charge</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {reservation.products.map((product) =>
                                                            product.product_charges.map((charge) => (
                                                                <tr
                                                                    key={`${product.id}-${charge.special_product_assignment_id}`}
                                                                >
                                                                    <td>{product.name}</td>
                                                                    <td>
                                                                        <span
                                                                            className={`status ${charge.active ? 'active' : 'inactive'}`}
                                                                        >
                                                                            {charge.active ? 'Active' : 'Inactive'}
                                                                        </span>
                                                                    </td>
                                                                    <td>${charge.amount.toFixed(2)}</td>
                                                                </tr>
                                                            ))
                                                        )}
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                    </>
                                )}
                            </>
                        ))}
                    </tbody>
                </table>
            </div>
            <style jsx>{`
                .hotel-container {
                    max-width: 1000px;
                    margin: 20px auto;
                    padding: 20px;
                    font-family: Arial, sans-serif;
                }

                h1 {
                    text-align: center;
                    color: #333;
                    margin-bottom: 30px;
                }

                .reservations-table {
                    width: 100%;
                    border-collapse: collapse;
                    border: 1px solid #ddd;
                }

                .reservations-table th,
                .reservations-table td {
                    padding: 12px;
                    text-align: left;
                    border: 1px solid #ddd;
                }

                .reservations-table th {
                    background-color: #f5f5f5;
                    font-weight: bold;
                }

                .main-row {
                    cursor: pointer;
                    transition: background-color 0.2s;
                }

                .main-row:hover {
                    background-color: #f9f9f9;
                }

                .expand-indicator {
                    display: inline-block;
                    width: 20px;
                    font-weight: bold;
                    color: #666;
                }

                .sub-header td {
                    padding: 0;
                    background-color: #fafafa;
                }

                .products-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 10px 0;
                }

                .products-table th,
                .products-table td {
                    padding: 8px 12px;
                    text-align: left;
                    border: 1px solid #eee;
                }

                .products-table th {
                    background-color: #f0f0f0;
                    font-size: 14px;
                }

                .products-table td {
                    font-size: 14px;
                    padding-left: 20px;
                }

                .status {
                    padding: 4px 8px;
                    border-radius: 4px;
                    font-size: 12px;
                    font-weight: bold;
                }

                .status.active {
                    background-color: #d4edda;
                    color: #155724;
                }

                .status.inactive {
                    background-color: #f8d7da;
                    color: #721c24;
                }
            `}</style>
        </>
    )
}

export default Hotel
