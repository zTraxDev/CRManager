import { model, Schema, SchemaTypes } from 'mongoose'
import { ClientDocument } from '../interface/client.interface'

const clientSchema = new Schema<ClientDocument>({
    name: {
        type: String,
        required: true
    },
    pay: {
        type: Number,
        required: true,
    },
    plan: {
        type: Schema.Types.ObjectId,
        ref: 'Plans'
    },
    date_pay: {
        type: Date,
    },
    user: {
        type: SchemaTypes.ObjectId,
        ref: 'Users'
    }
})

export const Client = model<ClientDocument>('Clients', clientSchema)
