import { model, Schema } from 'mongoose';

import { Employer, Organisation } from '../@types/models.types';

const addressSchema = new Schema({
  city: { type: String, required: true },
  state: { type: String, required: true },
  zip: { type: String, required: true },
  country: { type: String, required: true },
});

const organisationSchema = new Schema<Organisation>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  yearFounded: { type: Number, required: true },
  website: { type: String, required: true },
  logo: { type: String, required: true },
  address: { type: addressSchema, required: true },
});

const employerSchema = new Schema<Employer>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  phone: { type: String },
  organisation: { type: organisationSchema, required: true },
});

export const EmployerModel = model<Employer>('Employer', employerSchema);
