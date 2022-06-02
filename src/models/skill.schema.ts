import { Document, model, Schema } from 'mongoose';

import type { SkillAttrs } from '../@types';

interface SkillDoc extends SkillAttrs, Document {}

const skillSchema = new Schema<SkillDoc>({
  name: { type: String, required: true, unique: true },
});

export const Skill = model<SkillDoc>('Skill', skillSchema);
