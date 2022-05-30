import { model, Schema } from 'mongoose';

import { JobAttrs } from '../@types/jobseeker.types';

const jobSchema = new Schema<JobAttrs>({
  jobId: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  employer: { type: Schema.Types.ObjectId, ref: 'Employer', required: true },
  description: { type: String, required: true },
});

export const Job = model<JobAttrs>('Job', jobSchema);
