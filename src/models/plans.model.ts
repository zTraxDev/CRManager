import { model, Schema, SchemaTypes, Document } from 'mongoose'
import { PlanIU } from '../interface/plan.interface'

interface PlanDocument extends PlanIU, Document {}

const plansSchema = new Schema<PlanDocument>({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    mbpsupload: {
        type: Number,
        required: true
    },
    mbpsdownload: {
        type: Number,
        required: true
    },
    user: {
        type: SchemaTypes.ObjectId,
        ref: 'Users'
    }
})

export const planModel = model<PlanDocument>('Plans', plansSchema)