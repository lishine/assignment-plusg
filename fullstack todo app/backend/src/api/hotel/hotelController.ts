import type { Request, RequestHandler, Response } from 'express'

import { hotelService } from './hotelService'

class HotelController {
    public getHotelProducts: RequestHandler = async (_req: Request, res: Response) => {
        const serviceResponse = await hotelService.getHotelProducts()
        res.status(serviceResponse.statusCode).send(serviceResponse)
    }
}

export const hotelController = new HotelController()
