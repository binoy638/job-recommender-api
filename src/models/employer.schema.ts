/* eslint-disable no-param-reassign */
/* eslint-disable consistent-return */
import { Document, Model, model, Schema } from 'mongoose';

import { generateID } from '../utils/generateID';
import { Password } from '../utils/password';
import { EmployerFormData } from '../validators/employer.validator';

export interface Address {
  city: string;
  state: string;
  country: string;
}

interface Company {
  name: string;
  description: string;
  yearFounded: number;
  employees?: number;
  website: string;
  logo: string;
  address: Address;
}

export interface EmployerAttrs {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  company: Company;
  isVerified: boolean;
  isBanned: boolean;
  createdAt: string;
  updatedAt: string;
}

interface EmployerDoc extends EmployerAttrs, Document {}

// extend the Model interface with a static method to validate a employer
interface EmployerModel extends Model<EmployerDoc> {
  validateEmployer(email: string, password: string): Promise<Omit<EmployerDoc, 'password'> | undefined>;
  build(employerData: EmployerFormData): EmployerDoc;
}

export const addressSchema = new Schema<Address>({
  city: { type: String, required: true },
  state: { type: String, required: true },
  country: { type: String, required: true },
});

const companySchema = new Schema<Company>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  employees: { type: Number },
  yearFounded: { type: Number, required: true },
  website: { type: String, required: true },
  logo: { type: String },
  address: { type: addressSchema, required: true },
});

const employerSchema = new Schema<EmployerDoc>(
  {
    id: { type: Number, default: generateID(), required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    company: { type: companySchema, required: true },
    isVerified: { type: Boolean, default: false },
    isBanned: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

// This function runs when new employer is created to hash the password
employerSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  this.password = await Password.toHash(this.password);
  return next();
});

// Helper function to validate a employer
employerSchema.static('validateEmployer', async function (email: string, password: string): Promise<
  Omit<EmployerDoc, 'password'> | undefined
> {
  const employer = await this.findOne({ email }).lean(true);
  if (!employer) return;
  const isPasswordValid = await Password.compare(password, employer.password);
  if (!isPasswordValid) return;
  delete employer.password;
  delete employer.__v;
  return employer;
});

employerSchema.static('build', function (employerData: EmployerFormData) {
  return new this(employerData);
});

export const Employer = model<EmployerDoc, EmployerModel>('Employer', employerSchema);
