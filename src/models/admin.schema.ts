import { Document, model, Schema } from 'mongoose';

import { AdminAttrs } from '../@types';

interface AdminDoc extends AdminAttrs, Document {}

const adminSchema = new Schema<AdminDoc>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

export const Admin = model<AdminDoc>('Admin', adminSchema);
