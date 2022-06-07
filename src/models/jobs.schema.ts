import { model, Schema } from 'mongoose';

import { JobAttrs } from '../@types/job.types';

const jobsSchema = new Schema<JobAttrs>({
  id: { type: Number, required: true, unique: true },
  jobTitle: { type: String, required: true },
  employer: { type: Schema.Types.ObjectId, ref: 'Employer', required: true },
  description: { type: String, required: true },
  requiredSkills: [{ type: Schema.Types.ObjectId, ref: 'Skill' }],
  numberOfOpenings: { type: Number, required: true },
  category: { type: Schema.Types.ObjectId, ref: 'JobCategories', required: true },
  ctc: { type: Number },
  applyBy: { type: Date, required: true },
  startDate: { type: Date },
});

export const Jobs = model<JobAttrs>('Jobs', jobsSchema);
