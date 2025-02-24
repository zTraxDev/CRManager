import { UserDocument } from "../../interface/user.interface";

declare global {
    namespace Express {
        interface User extends UserDocument {} // ✅ Ahora req.user tiene el tipo correcto
    }
}
