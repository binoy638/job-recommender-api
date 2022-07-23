import { z } from 'zod';

// const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\(\d{2,3}\\)[ \\-]*)|(\d{2,4})[ \\-]*)*?\d{3,4}?[ \\-]*\d{3,4}?$/;

export const jobseekerPostSchema = z.object({
  firstName: z.string().min(2, { message: 'First Name should have at least 2 characters' }),
  lastName: z.string().min(2, { message: 'Last Name should have at least 2 characters' }),
  email: z.string().email({ message: 'Invalid email' }),
  phone: z.string().min(10, { message: 'Phone number should have at least 10 digits' }),
  password: z.string().min(6, { message: 'Password should have at least 8 characters' }),
  address: z.object({
    city: z.string().min(2, { message: 'City should have at least 2 characters' }),
    state: z.string().min(2, { message: 'State should have at least 2 characters' }),
    country: z.string().min(2, { message: 'State should have at least 2 characters' }),
  }),
  skills: z.array(z.string()),
  jobPreferences: z.array(z.string()),
  about: z.string().max(1000, { message: 'About can have at most 1000 characters' }),
  education: z.array(
    z.object({
      degree: z.string(),
      institute: z.string(),
      startYear: z.number(),
      endYear: z.number(),
    })
  ),
  experience: z.array(
    z.object({
      role: z.string(),
      company: z.string(),
      startYear: z.number(),
      endYear: z.number().optional(),
      description: z.string().optional(),
    })
  ),
  resume: z.string().optional(),
});

export type JobSeekerFormData = z.infer<typeof jobseekerPostSchema>;
