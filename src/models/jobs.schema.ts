import { Document, model, Schema } from 'mongoose';

import { generateID } from '../utils/generateID';
import { Address, addressSchema } from './employer.schema';

export enum JobMode {
  FULLTIME = 'FULLTIME',
  PARTTIME = 'PARTTIME',
}

export interface JobAttrs {
  jobTitle: string;
  employer: string;
  requiredSkills?: Schema.Types.ObjectId[];
  mode: JobMode;
  numberOfOpenings: number;
  location?: Address[];
  category: Schema.Types.ObjectId;
  ctc?: number;
  applyBy: Schema.Types.Date;
  startDate?: Schema.Types.Date;
  description: string;
}

export interface JobDoc extends JobAttrs, Document {}

const jobSchema = new Schema<JobDoc>({
  id: { type: Number, default: generateID(), required: true, unique: true },
  jobTitle: { type: String, required: true },
  employer: { type: Schema.Types.ObjectId, ref: 'Employer', required: true },
  description: { type: String, required: true },
  mode: { type: String, enum: [JobMode.FULLTIME, JobMode.PARTTIME] },
  requiredSkills: [{ type: Schema.Types.ObjectId, ref: 'Skill' }],
  numberOfOpenings: { type: Number, required: true },
  category: { type: Schema.Types.ObjectId, ref: 'JobCategories', required: true },
  location: { type: [addressSchema] },
  ctc: { type: Number },
  applyBy: { type: Date, required: true },
  startDate: { type: Date },
});

export const Job = model<JobDoc>('Job', jobSchema);
