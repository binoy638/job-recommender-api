import { Document, model, Schema } from 'mongoose';

import { JobCategoryAttrs } from '../@types/job.types';

interface JobCategoryDoc extends JobCategoryAttrs, Document {}

const jobCategoriesSchema = new Schema<JobCategoryDoc>({
  name: { type: String, required: true, unique: true },
});

export const JobCategories = model<JobCategoryDoc>('JobCategories', jobCategoriesSchema);
