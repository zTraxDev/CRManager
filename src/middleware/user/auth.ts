import { Request, Response, NextFunction } from 'express'

export const authMiddleware = (req: Request, res: Response, next: NextFunction): any => {
    if(req.isAuthenticated()){
        console.log(req.isAuthenticated())
        return next()
    }
    return res.status(401).json({
        success: false,
        message: 'No autorizado'
    })
}