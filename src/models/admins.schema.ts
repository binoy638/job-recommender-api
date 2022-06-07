/* eslint-disable consistent-return */
import { Document, Model, model, Schema } from 'mongoose';

import { AdminAttrs } from '../@types';
import { Password } from '../services/password';

interface AdminDoc extends AdminAttrs, Document {}

interface AdminModel extends Model<AdminDoc> {
  validateAdmin(email: string, password: string): Promise<Omit<AdminDoc, 'password'> | undefined>;
}

const adminsSchema = new Schema<AdminDoc>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

adminsSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  this.password = await Password.toHash(this.password);
  return next();
});

adminsSchema.static('validateAdmin', async function (email: string, password: string): Promise<
  Omit<AdminDoc, 'password'> | undefined
> {
  const admin = await this.findOne({ email }).lean(true);
  if (!admin) return;
  const isPasswordValid = await Password.compare(password, admin.password);
  if (!isPasswordValid) return;
  return admin;
});

export const Admins = model<AdminDoc, AdminModel>('Admins', adminsSchema);
