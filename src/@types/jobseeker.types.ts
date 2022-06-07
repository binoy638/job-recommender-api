import { Address, User } from './index';

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

export interface JobSeekerAttrs extends User {
  address: Address;
  about: string;
  education: Education[];
  experience: Experience[];
  //* store skill id's
  skills?: string[];
  //* store jobcategory id's
  jobPreferences: string[];
  resume: string;
}
