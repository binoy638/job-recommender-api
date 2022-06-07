export interface JobCategoryAttrs {
  jobCategoryId: number;
  name: string;
}
export interface JobAttrs {
  id: number;
  jobTitle: string;
  employer: string;
  position: string;
  requiredSkills?: string[];
  numberOfOpenings: number;
  category: string;
  ctc?: number;
  applyBy: string;
  startDate?: string;
  duration?: number;
  description: string;
}
