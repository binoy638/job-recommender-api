import { Schema } from 'mongoose';

import { Address } from './index';

export interface JobCategoryAttrs {
  name: string;
}
export interface JobAttrs {
  jobTitle: string;
  employer: string;
  requiredSkills?: string[];
  numberOfOpenings: number;
  location: Address;
  category: string;
  ctc?: number;
  applyBy: Schema.Types.Date;
  startDate?: Schema.Types.Date;
  description: string;
}
