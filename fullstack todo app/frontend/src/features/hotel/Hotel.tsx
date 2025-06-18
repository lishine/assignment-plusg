import React, { useEffect } from 'react'
import { useAccessHotelStore } from './hotelStore'
import ReservationTable from './components/ReservationTable'

const Hotel = () => {
    const { useHotelStore } = useAccessHotelStore()
    const groupedReservations = useHotelStore((state) => state.groupedReservations)
    const isLoading = useHotelStore((state) => state.isLoading)
    const error = useHotelStore((state) => state.error)

    useEffect(() => {
        useHotelStore.getState().fetchHotelProducts()
    }, [useHotelStore])

    if (isLoading) {
        return (
            <div className="hotel-container">
                <p>Loading hotel reservations...</p>
                <style jsx>{`
                    .hotel-container {
                        max-width: 1000px;
                        margin: 20px auto;
                        padding: 20px;
                        font-family: Arial, sans-serif;
                    }
                    p {
                        text-align: center;
                        color: #666;
                    }
                `}</style>
            </div>
        )
    }

    if (error) {
        return (
            <div className="hotel-container">
                <p>Error fetching hotel reservations: {error}</p>
                <style jsx>{`
                    .hotel-container {
                        max-width: 1000px;
                        margin: 20px auto;
                        padding: 20px;
                        font-family: Arial, sans-serif;
                    }
                    p {
                        text-align: center;
                        color: #d32f2f;
                    }
                `}</style>
            </div>
        )
    }

    return (
        <div className="hotel-container">
            <h1>Hotel Reservations</h1>
            <ReservationTable reservations={groupedReservations} />
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
            `}</style>
        </div>
    )
}

export default Hotel
