import { model, Schema } from 'mongoose';

import { JobAttrs } from '../@types/job.types';

const jobSchema = new Schema<JobAttrs>({
  id: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  employer: { type: Schema.Types.ObjectId, ref: 'Employer', required: true },
  description: { type: String, required: true },
  position: { type: String, required: true },
  requirements: { type: [String], required: true },
});

export const Job = model<JobAttrs>('Job', jobSchema);
