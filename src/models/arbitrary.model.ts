import { Schema, model, Document } from "mongoose";
import {ObjectId} from "mongodb";

export const ARBITRARY_MODEL_NAME = 'Arbitrary';

interface IArbitrary extends Document<ObjectId> {
    data: any;
}

const ArbitrarySchema = new Schema<IArbitrary>({
    data: Schema.Types.Mixed,
});

export const ArbitraryModel = model<IArbitrary>(ARBITRARY_MODEL_NAME, ArbitrarySchema);
