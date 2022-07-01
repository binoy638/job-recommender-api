import { z } from 'zod';

import { JobMode, WorkHours } from '../models/jobs.schema';

export const jobPostSchema = z.object({
  jobTitle: z
    .string()
    .min(3, { message: 'Job Title should have at least 3 characters' })
    .max(30, { message: 'Job Title should have at most 50 characters' }),
  mode: z.nativeEnum(JobMode),
  numberOfOpenings: z.number().min(1, { message: 'Number of openings should be at least 1' }),
  workHours: z.nativeEnum(WorkHours),
  category: z.string(),
  applyBy: z.date(),
  startDate: z.date(),
  salaryMin: z.string().optional(),
  salaryMax: z.string().optional(),
  salaryNegotiable: z.boolean().optional(),
  description: z
    .string()
    .min(3, { message: 'Description should have at least 3 characters' })
    .max(2000, { message: 'Description should have at most 1000 characters' }),
  requiredSkills: z.array(z.string()),
});

export type JobFormData = z.infer<typeof jobPostSchema>;
