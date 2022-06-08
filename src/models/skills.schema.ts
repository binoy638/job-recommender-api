import { Document, model, Schema } from 'mongoose';

interface SkillDoc extends Document {
  name: string;
}

const skillSchema = new Schema<SkillDoc>({
  name: { type: String, required: true, unique: true },
});

export const Skill = model<SkillDoc>('Skill', skillSchema);
