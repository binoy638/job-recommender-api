/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/ban-types */
import { Document, Model, model, Schema } from 'mongoose';

import { Address } from '../@types';
import { EmployerAttrs, Organisation } from '../@types/employer.types';
import { generateID } from '../utils/generateID';
import { Password } from '../utils/password';

interface EmployerDoc extends EmployerAttrs, Document {}

// extend the Model interface with a static method to validate a employer
interface EmployersModel extends Model<EmployerDoc> {
  validateEmployer(email: string, password: string): Promise<Omit<EmployerDoc, 'password'> | undefined>;
  build(employerData: EmployerAttrs): EmployerDoc;
}

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

const employersSchema = new Schema<EmployerDoc>(
  {
    _id: { type: Number, default: generateID(), required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, unique: true },
    organisation: { type: organisationSchema, required: true },
    isVerified: { type: Boolean, default: false },
    isBanned: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
      },
      versionKey: false,
    },
  }
);

// This function runs when new employer is created to hash the password
employersSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  this.password = await Password.toHash(this.password);
  return next();
});

// Helper function to validate a employer
employersSchema.static('validateEmployer', async function (email: string, password: string): Promise<
  Omit<EmployerDoc, 'password'> | undefined
> {
  const employer = await this.findOne({ email }).lean(true);
  if (!employer) return;
  const isPasswordValid = await Password.compare(password, employer.password);
  if (!isPasswordValid) return;
  return employer;
});

employersSchema.static('build', function (employerData: EmployerAttrs) {
  return new this(employerData);
});

export const Employers = model<EmployerDoc, EmployersModel>('Employers', employersSchema);
