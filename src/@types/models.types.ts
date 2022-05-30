export enum UserType {
  EMPLOYER = 'employer',
  JOBSEEKER = 'jobseeker',
  ADMIN = 'admin',
}

export enum RequestResponse {
  INVALID_PAYLOAD = 'Invalid request payload',
}

export interface Admin {
  username: string;
  email: string;
  password: string;
}

export interface Address {
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
}

export interface Organisation {
  name: string;
  description: string;
  yearFounded: number;
  website: string;
  logo: string;
  address: Address;
}

export interface EmployerAttrs extends User {
  employerId: number;
  organisation: Organisation;
  verified: boolean;
}

export interface Education {
  degree: string;
  institute: string;
  startYear: number;
  endYear: number;
  percentage: number;
}

export interface JobAttrs {
  jobId: number;
  title: string;
  employer: string;
  description: string;
}

export interface JobSeeker extends User {
  address: Address;
  education: Education[];
  // TODO: convert to objects
  experience: string;
  skills: string;
  jobPreferences: string;
  jobHistory: string;
  resume: string;
}
