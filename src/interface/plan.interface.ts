import { model, Schema, SchemaTypes, Document } from 'mongoose'

interface PlanIU {
    name: Schema.Types.String,
    price: Number,
    mbpsupload: Number,
    mbpsdownload: Number,
    user: Schema.Types.ObjectId
}

export { PlanIU }