import { Document, model, Schema } from 'mongoose';

interface StateDoc extends Document {
  id: number;
  name: string;
  countryID: number;
}

const stateSchema = new Schema<StateDoc>({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  countryID: { type: Number, required: true },
});

export const State = model<StateDoc>('State', stateSchema);
