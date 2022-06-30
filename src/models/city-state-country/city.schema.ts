import { Document, model, Schema } from 'mongoose';

interface CityDoc extends Document {
  name: string;
  stateID: number;
}

const citySchema = new Schema<CityDoc>({
  name: { type: String, required: true },
  stateID: { type: Number, required: true },
});

export const City = model<CityDoc>('City', citySchema);
