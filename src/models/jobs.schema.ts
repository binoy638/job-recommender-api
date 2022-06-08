import { Document, model, Schema } from 'mongoose';

import { JobAttrs } from '../@types/job.types';
import { generateID } from '../utils/generateID';
import { addressSchema } from './employers.schema';

interface JobDoc extends JobAttrs, Document {}

const jobsSchema = new Schema<JobDoc>({
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

export const Jobs = model<JobDoc>('Jobs', jobsSchema);
