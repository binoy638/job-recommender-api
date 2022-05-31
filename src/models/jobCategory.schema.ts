import { Document, model, Schema } from 'mongoose';

import { JobCategoryAttrs } from '../@types/job.types';

interface JobCategoryDoc extends JobCategoryAttrs, Document {}

const jobCategorySchema = new Schema<JobCategoryDoc>({
  jobCategoryId: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
});

export const JobCategory = model<JobCategoryDoc>('JobCategory', jobCategorySchema);
