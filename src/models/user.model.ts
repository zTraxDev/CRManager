import { model, Schema, SchemaTypes } from 'mongoose';
import { UserDocument } from '../interface/user.interface';

const userSchema = new Schema<UserDocument>({
    name: {
        type: SchemaTypes.String,
        required: true
    },
    email: {
        type: SchemaTypes.String,
        required: true,
        unique: true
    },
    password: {
        type: SchemaTypes.String,
        required: true
    },
    clients: [{
        type: SchemaTypes.ObjectId,
        ref: 'Clients'
    }],
    plans: [{
        types: SchemaTypes.ObjectId,
        ref: 'Planes'
    }],
    role: {
        type: String,
        enum: ['user', 'manager', 'admin']
    }
})

export const userModel = model<UserDocument>('Users', userSchema)
