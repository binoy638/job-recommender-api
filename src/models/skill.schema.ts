import { model, Schema } from 'mongoose';

import { SkillAttrs } from '../@types';

const skillSchema = new Schema<SkillAttrs>({
  name: { type: String, required: true },
  level: { enum: ['beginner', 'intermediate', 'advanced'], required: true },
});

export const skill = model<SkillAttrs>('Skill', skillSchema);
