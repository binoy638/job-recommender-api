/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/ban-types */
import Bcrypt from 'bcrypt';
import { Model, model, Schema } from 'mongoose';

import { IAddress, IEmployer, IOrganisation } from '../@types/models.types';

// extend the Model interface with a static method to validate a employer
interface EmployerModel extends Model<IEmployer> {
  validateEmployer(email: string, password: string): Promise<IEmployer | undefined>;
}

const addressSchema = new Schema<IAddress>({
  city: { type: String, required: true },
  state: { type: String, required: true },
  zip: { type: String, required: true },
  country: { type: String, required: true },
});

const organisationSchema = new Schema<IOrganisation>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  yearFounded: { type: Number, required: true },
  website: { type: String, required: true },
  logo: { type: String, required: true },
  address: { type: addressSchema, required: true },
});

const employerSchema = new Schema<IEmployer, EmployerModel>(
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

// This function runs when new employer is created to hash the password
employerSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await Bcrypt.genSalt(10);
  this.password = await Bcrypt.hash(this.password, salt);
  return next();
});

// Helper function to validate a employer
employerSchema.static('validateEmployer', async function (email: string, password: string): Promise<
  IEmployer | undefined
> {
  const employer = await this.findOne({ email }).lean();
  if (!employer) return;
  const isPasswordValid = await Bcrypt.compare(password, employer.password);
  if (!isPasswordValid) return;
  // remove password field before returning
  const { password: _, ...employerDetails } = employer;
  return employerDetails as IEmployer;
});

export const Employer = model<IEmployer, EmployerModel>('Employer', employerSchema);
