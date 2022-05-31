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

export enum SkillLevel {
  BEGINNER = 'Beginner',
  INTERMEDIATE = 'Intermediate',
  EXPERT = 'Expert',
}

export interface JobSeekerAttrs extends User {
  jobSeekerId: number;
  address: Address;
  about: string;
  education: Education[];
  experience: Experience[];
  //* store skill id's
  skills: { skill: string; level: SkillLevel }[];
  //* store jobcategory id's
  jobPreferences: string[];
  resume: string;
}
