import { z } from 'zod';

export const ID = z.object({ id: z.string().regex(/^\d+$/).transform(Number) });

export const messageSchema = z.object({
  id: z.string(),
  message: z.string(),
});

export type MessageData = z.infer<typeof messageSchema>;
