import { Document, model, Schema } from 'mongoose';

import { generateID } from '../utils/generateID';

interface JobApplicationDoc extends Document {
  id: number;
  job: Schema.Types.ObjectId;
  jobSeeker: Schema.Types.ObjectId;
  //! need to add additional fields
}

const jobApplicationSchema = new Schema<JobApplicationDoc>({
  id: { type: Number, default: generateID(), required: true, unique: true },
  job: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
  jobSeeker: { type: Schema.Types.ObjectId, ref: 'JobSeeker', required: true },
});

export const JobApplication = model<JobApplicationDoc>('JobApplication', jobApplicationSchema);
