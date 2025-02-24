import { model, Schema, SchemaTypes, Document } from 'mongoose'

interface UserIU {
    name: String,
    email: String,
    password: String,
    clients: Schema.Types.ObjectId[],
    plans: Schema.Types.ObjectId[],
    role: String
}

interface UserDocument extends UserIU, Document {}


export { UserDocument, UserIU}