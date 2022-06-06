/* eslint-disable consistent-return */
import { Document, Model, model, Schema } from 'mongoose';

import { AdminAttrs } from '../@types';
import { Password } from '../services/password';

interface AdminDoc extends AdminAttrs, Document {}

interface AdminModel extends Model<AdminDoc> {
  validateAdmin(email: string, password: string): Promise<Omit<AdminDoc, 'password'> | undefined>;
}

const adminSchema = new Schema<AdminDoc>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

adminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  this.password = await Password.toHash(this.password);
  return next();
});

adminSchema.static('validateAdmin', async function (email: string, password: string): Promise<
  Omit<AdminDoc, 'password'> | undefined
> {
  const admin = await this.findOne({ email }).lean(true);
  if (!admin) return;
  const isPasswordValid = await Password.compare(password, admin.password);
  if (!isPasswordValid) return;
  return admin;
});

export const Admin = model<AdminDoc, AdminModel>('Admin', adminSchema);
