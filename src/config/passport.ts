import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { UserDocument } from "../interface/user.interface";
import { userModel } from "../models/user.model";
import bcrypt from "bcryptjs"
import { eventLogger } from "../utils/logger/logger";
import { Types } from "mongoose";

passport.use(
    new LocalStrategy(
        {usernameField: 'email', passwordField: 'password'},
        async (email, password, done) => {
            const user = await userModel.findOne({ email }).exec()

            if(!user) return done(null, false, { message: 'Este usuario no existe'})

            const isMatch = await bcrypt.compare(password, user.password as string)

            if(!isMatch) return done(null, false, { message: 'Usuario o contraseña invalida'})

            eventLogger.info(`Usuario logeado: ${email}`)
            return done(null, user)
        }
    )
)

passport.serializeUser((user: UserDocument, done) => done(null, user._id))

passport.deserializeUser(async (id: string, done) => {
    try {
        const user = await userModel.findById(new Types.ObjectId(id)).exec();
        
        if(!user){
            return done(null, false)
        }

        return done(null, user)
    } catch (error: any) {
        eventLogger.error(error)
        return done(error)
    }
})

export default passport