import { Document, model, Schema } from 'mongoose';

import type { SkillAttrs } from '../@types';
import { generateID } from '../utils/generateID';

interface SkillDoc extends SkillAttrs, Document {}

const skillsSchema = new Schema<SkillDoc>({
  _id: { type: Number, default: generateID(), required: true, unique: true },
  name: { type: String, required: true, unique: true },
});

export const Skills = model<SkillDoc>('Skills', skillsSchema);
