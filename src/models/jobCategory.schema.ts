import { Document, model, Schema } from 'mongoose';

import { JobCategoryAttrs } from '../@types/job.types';

interface JobCategoryDoc extends JobCategoryAttrs, Document {}

const jobCategorySchema = new Schema<JobCategoryDoc>({
  name: { type: String, required: true, unique: true },
});

export const JobCategory = model<JobCategoryDoc>('JobCategory', jobCategorySchema);
