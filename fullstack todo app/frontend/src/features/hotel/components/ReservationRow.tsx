import React from 'react'
import ProductsTable from './ProductsTable'
import type { ReservationGroup } from '../../../types/hotel.types'

interface ReservationRowProps {
    reservation: ReservationGroup
    isExpanded: boolean
    onToggle: () => void
}

const ReservationRow: React.FC<ReservationRowProps> = ({ reservation, isExpanded, onToggle }) => {
    return (
        <>
            <tr onClick={onToggle} className="reservation-row">
                <td>
                    <span className="expand-icon">{isExpanded ? '▼' : '▶'}</span>
                    {reservation.reservation_uuid}
                </td>
                <td>{reservation.activeCount} active</td>
                <td>${reservation.totalActiveAmount.toFixed(2)}</td>
                <td>{reservation.products.length} products</td>
            </tr>
            {isExpanded && (
                <tr>
                    <td colSpan={4} className="products-container">
                        <ProductsTable products={reservation.products} />
                    </td>
                </tr>
            )}
            <style jsx>{`
                .reservation-row {
                    cursor: pointer;
                    background-color: #f8f9fa;
                }
                .reservation-row:hover {
                    background-color: #e9ecef;
                }
                .expand-icon {
                    margin-right: 8px;
                    font-size: 12px;
                }
                .products-container {
                    padding: 16px;
                    background-color: #ffffff;
                }
                .products-container :global(.products-table) {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 8px;
                }
                .products-container :global(.products-table th),
                .products-container :global(.products-table td) {
                    padding: 8px;
                    text-align: left;
                    border-bottom: 1px solid #dee2e6;
                }
                .products-container :global(.products-table th) {
                    background-color: #f8f9fa;
                    font-weight: 600;
                }
            `}</style>
        </>
    )
}

export default ReservationRow
