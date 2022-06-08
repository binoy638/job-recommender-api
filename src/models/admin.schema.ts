/* eslint-disable no-param-reassign */
/* eslint-disable consistent-return */
import { Document, Model, model, Schema } from 'mongoose';

import { generateID } from '../utils/generateID';
import { Password } from '../utils/password';

interface AdminDoc extends Document {
  username: string;
  email: string;
  password: string;
}

interface AdminModel extends Model<AdminDoc> {
  validateAdmin(email: string, password: string): Promise<Omit<AdminDoc, 'password'> | undefined>;
}

const adminSchema = new Schema<AdminDoc>(
  {
    id: { type: Number, default: generateID(), required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

adminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  this.password = await Password.toHash(this.password);
  return next();
});

adminSchema.static('validateAdmin', async function (email: string, password: string): Promise<AdminDoc | undefined> {
  const admin = await this.findOne({ email }).lean(true);
  if (!admin) return;
  const isPasswordValid = await Password.compare(password, admin.password);
  if (!isPasswordValid) return;
  delete admin.password;
  delete admin.__v;
  return admin;
});

export const Admin = model<AdminDoc, AdminModel>('Admin', adminSchema);
