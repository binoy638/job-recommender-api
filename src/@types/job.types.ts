import { Schema } from 'mongoose';

export interface JobCategoryAttrs {
  name: string;
}
export interface JobAttrs {
  jobTitle: string;
  employer: string;
  requiredSkills?: string[];
  numberOfOpenings: number;
  category: string;
  ctc?: number;
  applyBy: Schema.Types.Date;
  startDate?: Schema.Types.Date;
  description: string;
}
