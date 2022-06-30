import { Document, model, Schema } from 'mongoose';

interface CountryDoc extends Document {
  id: number;
  name: string;
  code: string;
  phoneCode: string;
}

const countrySchema = new Schema<CountryDoc>({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  code: { type: String, required: true },
  phoneCode: { type: String, required: true },
});

export const Country = model<CountryDoc>('Country', countrySchema);
