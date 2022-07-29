import { Document, model, Schema } from 'mongoose';

import { generateID } from '../utils/generateID';

export enum WorkHours {
  FULLTIME = 'FULLTIME',
  PARTTIME = 'PARTTIME',
}

export enum JobMode {
  WFH = 'WFH',
  WFO = 'WFO',
}

interface Salary {
  negotiable: boolean;
  min: number;
  max: number;
}

export interface JobAttrs {
  jobTitle: string;
  employer: string;
  requiredSkills: Schema.Types.ObjectId[];
  mode: JobMode;
  numberOfOpenings: number;
  workHours: WorkHours;
  category: Schema.Types.ObjectId;
  salary?: Salary;
  applyBy: Schema.Types.Date;
  startDate: Schema.Types.Date;
  description: string;
  isActive: boolean;
  applications: Schema.Types.ObjectId[];
}

export interface JobDoc extends JobAttrs, Document {}

const jobSchema = new Schema<JobDoc>(
  {
    id: { type: Number, default: generateID(), required: true, unique: true },
    jobTitle: { type: String, required: true },
    employer: { type: Schema.Types.ObjectId, ref: 'Employer', required: true },
    description: { type: String, required: true },
    mode: { type: String, enum: [JobMode.WFH, JobMode.WFO] },
    requiredSkills: [{ type: Schema.Types.ObjectId, ref: 'Skill', default: [] }],
    numberOfOpenings: { type: Number, required: true },
    category: { type: Schema.Types.ObjectId, ref: 'JobCategory', required: true },
    workHours: { type: String, enum: [WorkHours.FULLTIME, WorkHours.PARTTIME] },
    salary: {
      negotiable: { type: Boolean, default: false },
      min: { type: Number },
      max: { type: Number },
    },
    applyBy: { type: Date, required: true },
    startDate: { type: Date },
    isActive: { type: Boolean, default: true },
    applications: { type: [Schema.Types.ObjectId], ref: 'JobApplication', default: [] },
  },
  {
    timestamps: true,
  }
);

export const Job = model<JobDoc>('Job', jobSchema);
