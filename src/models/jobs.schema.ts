import { model, Schema } from 'mongoose';

import { JobAttrs } from '../@types/job.types';

const jobsSchema = new Schema<JobAttrs>({
  id: { type: Number, required: true, unique: true },
  jobTitle: { type: String, required: true },
  employer: { type: Schema.Types.ObjectId, ref: 'Employer', required: true },
  description: { type: String, required: true },
  position: { type: String, required: true },
  requiredSkills: [{ type: Schema.Types.ObjectId, ref: 'Skill' }],
});

export const Jobs = model<JobAttrs>('Jobs', jobsSchema);
