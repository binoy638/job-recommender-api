import { customAlphabet } from 'nanoid';

const nanoid = customAlphabet('0123456789', 12);

export const generateID = (): number => Number(nanoid());
