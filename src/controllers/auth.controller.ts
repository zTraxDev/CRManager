import { userModel } from "../models/user.model";
import { NextFunction, Request, Response } from 'express'
import { eventLogger, dbLogger } from "../utils/logger/logger";
import { hash, compare } from "bcryptjs";
import passport from "passport";
import sanitize from "mongo-sanitize";
import sessionStore from 'connect-mongo'

class AuthController {
    constructor() { }

    public async register(req: Request, res: Response): Promise<any> {
        try {
            const { name, email, password } = sanitize(req.body)

            const user = await userModel.findOne({ email })

            if (user) return res.json({
                success: false,
                message: 'Este correo ya existe'
            })

            const hashedpassword = await hash(password, 10)

            let userObject = {
                name,
                password: hashedpassword,
                email
            }

            let newUser = await userModel.create(userObject)

            dbLogger.info(`Usuario registrado exitosamente ${newUser.name}:${newUser.email}`)

            return res.status(201).json({
                success: true,
                message: 'Usuario registrado exitosamente',
                data: newUser
            })

        } catch (error: any) {
            eventLogger.error(`Error del servidor o registrar el usuario ${error}`)
        }
    }

    public async login(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            passport.authenticate('local', { session: true }, (err: any, user: any, info: any) => {
                if (err) return res.status(500).json({
                    status: 500,
                    success: false,
                    message: 'Error interno del servidor'
                })

                if (!user) return res.status(400).json({
                    status: 400,
                    success: false,
                    message: info.message
                })

                if(req.isAuthenticated()){
                    return res.status(400).json({
                        status: 400,
                        success: false,
                        message: 'Esta sesion ya esta abierta'
                    })
                }

                req.logIn(user, (err) => {
                    if (err) return res.status(500).json({
                        status: 500,
                        success: false,
                        message: 'Error interno del servidor'
                    })

                    req.session.name = user.name

                    return res.status(200).json({
                        status: 200,
                        success: true,
                        message: 'Usuario logeado exitosamente',
                        data: user
                    })
                })
            })(req, res, next);

        } catch (error: any) {
            eventLogger.error(`Error del servidor o iniciar sesión ${error}`)
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            })
        }
    }

    public async logout(req: Request, res: Response): Promise<any> {
        try {
            if (!req.user) {
                return res.status(400).json({ success: false, message: 'No hay sesión activa' });
            }
    
            eventLogger.info(`Sesión cerrada: ${req.user._id}`);
    
            req.logout((err: any) => {
                if (err) {
                    return res.status(500).json({ 
                        success: false, 
                        message: 'Error al cerrar sesión' 
                    });
                }
    
                if (!req.session) {
                    return res.status(200).json({
                        success: true,
                        message: 'Sesión cerrada correctamente'
                    });
                }
    
                req.session.destroy((err) => {
                    if (err) {
                        return res.status(500).json({ 
                            success: false, 
                            message: 'Error al destruir la sesión' 
                        });
                    }

                    req.sessionStore.destroy(req.sessionID, (err) => {
                        if (err) {
                            return res.status(500).json({ 
                                status: 500,
                                success: false, 
                                message: 'Error al destruir la sesión' 
                            })
                        }
                    })
    
                    res.clearCookie('connect.sid', { path: '/', httpOnly: true, secure: false });
                    return res.status(200).json({ 
                        success: true, 
                        message: 'Sesión cerrada correctamente' 
                    });
                });
            });
        } catch (error: any) {
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    }
    

    public async checkSession(req: Request, res: Response): Promise<any> {
        try {
            if(!req.isAuthenticated()){
                return res.status(400).json({
                    status: 400,
                    success: false,
                    message: 'No autorizado'
                })
            }

            return res.status(200).json({
                status: 200,
                success: true,
                user: req.user
            })
        } catch (error: any) {
            
        }
    }
}

export const authController = new AuthController()