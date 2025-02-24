import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { userModel } from "../models/user.model";
import bcrypt from "bcryptjs"
import { eventLogger } from "../utils/logger/logger";

passport.use(
    new LocalStrategy(
        {usernameField: 'email', passwordField: 'password'},
        async (email, password, done) => {
            const user = await userModel.findOne({ email })

            if(!user) return done(null, false, { message: 'Usuario o contraseña invalida'})

            const isMatch = await bcrypt.compare(password, user.password as string)

            if(!isMatch) return done(null, false, { message: 'Usuario o contraseña invalida'})

            eventLogger.info(`Usuario logeado: ${email}`)
            return done(null, user)
        }
    )
)

passport.serializeUser((user: any, done) => done(null, user._id))
passport.deserializeUser(async (id, done) => {
    try {
        const user = await userModel.findById(id)
        
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