import { z } from 'zod';

// const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\(\d{2,3}\\)[ \\-]*)|(\d{2,4})[ \\-]*)*?\d{3,4}?[ \\-]*\d{3,4}?$/;

export const employerPostSchema = z.object({
  firstName: z.string().min(2, { message: 'First Name should have at least 2 characters' }),
  lastName: z.string().min(2, { message: 'Last Name should have at least 2 characters' }),
  email: z.string().email({ message: 'Invalid email' }),
  phone: z.string().min(10, { message: 'Phone number should have at least 10 digits' }),
  password: z.string().min(6, { message: 'Password should have at least 8 characters' }),
  company: z.object({
    name: z.string().min(2, { message: 'Company Name should have at least 2 characters' }),
    description: z.string().min(2, { message: 'Description should have at least 10 characters' }).max(1000, {
      message: 'Description can have at most least 1000 characters',
    }),
    employees: z.number().min(1, { message: 'At least 1 employee' }).optional(),
    yearFounded: z.number().min(1900, { message: 'Year founded should be at least 1900' }),
    website: z.string().url({ message: 'Invalid website' }),
    address: z.object({
      city: z.string().min(2, { message: 'City should have at least 2 characters' }),
      state: z.string().min(2, { message: 'State should have at least 2 characters' }),
      country: z.string().min(2, { message: 'State should have at least 2 characters' }),
    }),
  }),
});

export type EmployerFormData = z.infer<typeof employerPostSchema>;
