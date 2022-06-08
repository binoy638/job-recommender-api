/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/ban-types */
import { Document, Model, model, Schema } from 'mongoose';

import { generateID } from '../utils/generateID';
import { Password } from '../utils/password';
import { Address } from './employer.schema';

interface Education {
  degree: string;
  institute: string;
  startYear: number;
  endYear: number;
  percentage: number;
}

interface Experience {
  role: string;
  startYear: number;
  endYear: number;
  company: string;
  description: string;
}

export interface JobSeekerAttrs {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  dob: Schema.Types.Date;
  address: Address;
  about: string;
  education: Education[];
  experience: Experience[];
  //* store skill id's
  skills?: Schema.Types.ObjectId[];
  //* store jobcategory id's
  jobPreferences: Schema.Types.ObjectId[];
  resume?: string;
}

// extend the Model interface with a static method to validate a employer
interface JobSeekerDoc extends JobSeekerAttrs, Document {}

interface JobSeekerModel extends Model<JobSeekerDoc> {
  validateJobSeeker(email: string, password: string): Promise<Omit<JobSeekerDoc, 'password'> | undefined>;
  build(jobSeekerData: JobSeekerAttrs): JobSeekerDoc;
}

const addressSchema = new Schema<Address>({
  city: { type: String, required: true },
  state: { type: String, required: true },
  country: { type: String, required: true },
});

const educationSchema = new Schema<Education>({
  degree: { type: String, required: true },
  institute: { type: String, required: true },
  startYear: { type: Number, required: true },
  endYear: { type: Number, required: true },
  percentage: { type: Number, required: true },
});
const experienceSchema = new Schema<Experience>({
  role: { type: String, required: true },
  company: { type: String, required: true },
  startYear: { type: Number, required: true },
  endYear: { type: Number, required: true },
  description: { type: String, required: true },
});

const jobSeekerSchema = new Schema<JobSeekerDoc>(
  {
    id: { type: Number, default: generateID(), required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, unique: true },
    address: { type: addressSchema, required: true },
    dob: { type: Schema.Types.Date, required: true },
    about: { type: String, required: true },
    education: { type: [educationSchema], required: true },
    experience: { type: [experienceSchema] },
    skills: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Skill',
        },
      ],
    },
    jobPreferences: [{ type: Schema.Types.ObjectId, ref: 'JobCategory' }],
    resume: { type: String },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
      },
      versionKey: false,
    },
  }
);

// This function runs when new employer is created to hash the password
jobSeekerSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  this.password = await Password.toHash(this.password);
  return next();
});

// Helper function to validate a employer
jobSeekerSchema.static('validateJobSeeker', async function (email: string, password: string): Promise<
  Omit<JobSeekerDoc, 'password'> | undefined
> {
  const jobSeeker = await this.findOne({ email }).lean(true);
  if (!jobSeeker) return;
  const isPasswordValid = await Password.compare(password, jobSeeker.password);
  if (!isPasswordValid) return;
  return jobSeeker;
});

jobSeekerSchema.static('build', function (jobseekerData: JobSeekerAttrs) {
  return new this(jobseekerData);
});

export const JobSeeker = model<JobSeekerDoc, JobSeekerModel>('JobSeeker', jobSeekerSchema);
