import { Document, model, Schema } from 'mongoose';

import type { SkillAttrs } from '../@types';

interface SkillDoc extends SkillAttrs, Document {}

const skillSchema = new Schema<SkillDoc>({
  skillId: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
});

export const Skill = model<SkillDoc>('Skill', skillSchema);
