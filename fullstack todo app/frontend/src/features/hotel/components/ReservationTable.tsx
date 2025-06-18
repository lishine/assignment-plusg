import React, { useState } from 'react'
import ReservationRow from './ReservationRow'
import type { ReservationGroup } from '../../../types/hotel.types'

interface ReservationTableProps {
    reservations: ReservationGroup[]
}

const ReservationTable: React.FC<ReservationTableProps> = ({ reservations }) => {
    const [expandedReservations, setExpandedReservations] = useState<Set<string>>(new Set())

    const toggleReservation = (reservationUuid: string) => {
        setExpandedReservations((prev) => {
            const newSet = new Set(prev)
            if (newSet.has(reservationUuid)) {
                newSet.delete(reservationUuid)
            } else {
                newSet.add(reservationUuid)
            }
            return newSet
        })
    }

    return (
        <div className="reservation-table-container">
            <table className="reservation-table">
                <thead>
                    <tr>
                        <th>Reservation ID</th>
                        <th>Active Products</th>
                        <th>Total Amount</th>
                        <th>Product Count</th>
                    </tr>
                </thead>
                <tbody>
                    {reservations.map((reservation) => (
                        <ReservationRow
                            key={reservation.reservation_uuid}
                            reservation={reservation}
                            isExpanded={expandedReservations.has(reservation.reservation_uuid)}
                            onToggle={() => toggleReservation(reservation.reservation_uuid)}
                        />
                    ))}
                </tbody>
            </table>
            <style jsx>{`
                .reservation-table-container {
                    margin-top: 20px;
                }
                .reservation-table {
                    width: 100%;
                    border-collapse: collapse;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }
                .reservation-table th,
                .reservation-table td {
                    padding: 12px;
                    text-align: left;
                    border-bottom: 1px solid #dee2e6;
                }
                .reservation-table th {
                    background-color: #f8f9fa;
                    font-weight: 600;
                    color: #495057;
                }
            `}</style>
        </div>
    )
}

export default ReservationTable
