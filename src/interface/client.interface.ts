import { Schema, Document } from 'mongoose'

interface ClientIU{
    name: String,
    pay: Number,
    plan: String,
    date_pay: Date,
    user: Schema.Types.ObjectId
}

interface ClientDocument extends Document, ClientIU {}

export { ClientDocument }
