export interface JobCategoryAttrs {
  jobCategoryId: number;
  name: string;
}
export interface JobAttrs {
  id: number;
  title: string;
  employer: string;
  position: string;
  requirements: string[];
  //* store skill id's
  skills?: string[];
  category: string;
  salary?: number;
  startDate?: string;
  duration?: number;
  description: string;
}
