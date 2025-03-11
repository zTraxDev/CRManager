import { Router, Request, Response, NextFunction } from "express"
import { ClientController } from "../../controllers/client.controller"
import { authMiddleware } from "../../middleware/user/auth"

const clientRouter = Router()

clientRouter.get('/all', authMiddleware, ClientController.getAllClients)
clientRouter.get('/search/:id', authMiddleware, ClientController.getClientById)
clientRouter.get('/:name', authMiddleware, ClientController.getClientByName)
clientRouter.post('/create', authMiddleware, ClientController.createClient)
clientRouter.patch('/update/:id', authMiddleware, ClientController.updateClient)
clientRouter.delete('/delete/:id', authMiddleware, ClientController.deleteClient)

export default clientRouter