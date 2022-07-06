import { z } from 'zod';

export const ID = z.object({ id: z.string().regex(/^\d+$/).transform(Number) });
