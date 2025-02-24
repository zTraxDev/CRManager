import { Request, Response, NextFunction } from 'express'

const includeIdforPath = (req: Request, res: Response, next: NextFunction): any => {
    try{
        const userId = req.user?._id;
        if(userId){
            req.body.user = userId;
            return next();
        }
        return res.status(401).json({
            success: false,
            message: 'No autorizado'
        })
    }
    catch(error: any){
        console.log(error)
    }
}