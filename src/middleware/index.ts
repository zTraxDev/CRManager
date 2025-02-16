import { Request, Response, NextFunction } from "express"
import { config } from "../config/config"

const sessionOnlyneCount = (req: Request, res: Response, next: NextFunction) => {
    if(!req.session.connected){
        req.session.connected = true
        config.connected_user++
    }
    next()
}

export { sessionOnlyneCount }