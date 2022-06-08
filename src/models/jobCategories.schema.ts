import { Document, model, Schema } from 'mongoose';

interface JobCategoryDoc extends Document {
  name: string;
}

const jobCategorySchema = new Schema<JobCategoryDoc>({
  name: { type: String, required: true, unique: true },
});

export const JobCategory = model<JobCategoryDoc>('JobCategory', jobCategorySchema);
