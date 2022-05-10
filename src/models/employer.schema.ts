import Bcrypt from 'bcrypt';
import { model, Schema } from 'mongoose';

import { Address, Employer, Organisation } from '../@types/models.types';

const addressSchema = new Schema<Address>({
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

const employerSchema = new Schema<Employer>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    phone: { type: String },
    organisation: { type: organisationSchema, required: true },
  },
  { timestamps: true }
);

employerSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await Bcrypt.genSalt(10);
  this.password = await Bcrypt.hash(this.password, salt);
  return next();
});

export const EmployerModel = model<Employer>('Employer', employerSchema);
