import { Address, JobCategory, Skill, User } from './index';

export interface Education {
  degree: string;
  institute: string;
  startYear: number;
  endYear: number;
  percentage: number;
}

export interface Experience {
  role: string;
  startYear: number;
  endYear: number;
  company: string;
  description: string;
}

export interface JobAttrs {
  jobId: number;
  title: string;
  employer: string;
  description: string;
}

export interface JobSeekerAttrs extends User {
  address: Address;
  education: Education[];
  experience: Experience[];
  skills: Skill[];
  jobPreferences: JobCategory[];
  //* store pdf url
  resume: string;
}
