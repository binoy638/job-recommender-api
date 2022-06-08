import { Document, model, Schema } from 'mongoose';

import { generateID } from '../utils/generateID';
import { Address, addressSchema } from './employer.schema';

export interface JobDoc extends Document {
  jobTitle: string;
  employer: string;
  requiredSkills?: Schema.Types.ObjectId[];
  numberOfOpenings: number;
  location: Address;
  category: Schema.Types.ObjectId;
  ctc?: number;
  applyBy: Schema.Types.Date;
  startDate?: Schema.Types.Date;
  description: string;
}

const jobSchema = new Schema<JobDoc>({
  id: { type: Number, default: generateID(), required: true, unique: true },
  jobTitle: { type: String, required: true },
  employer: { type: Schema.Types.ObjectId, ref: 'Employer', required: true },
  description: { type: String, required: true },
  requiredSkills: [{ type: Schema.Types.ObjectId, ref: 'Skill' }],
  numberOfOpenings: { type: Number, required: true },
  category: { type: Schema.Types.ObjectId, ref: 'JobCategories', required: true },
  location: { type: addressSchema, required: true },
  ctc: { type: Number },
  applyBy: { type: Date, required: true },
  startDate: { type: Date },
});

export const Job = model<JobDoc>('Job', jobSchema);
