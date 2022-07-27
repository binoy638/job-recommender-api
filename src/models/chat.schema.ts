import { Document, model, Schema } from 'mongoose';

export interface Message {
  message: string;
  sender: string;
  unread: boolean;
}

interface ChatDoc extends Document {
  employer: Schema.Types.ObjectId;
  jobseeker: Schema.Types.ObjectId;
  messages: Message[];
  isBlocked: boolean;
}

const messageSchema = new Schema<Message>(
  {
    message: { type: String, required: true },
    sender: { type: String, required: true },
    unread: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const chatSchema = new Schema<ChatDoc>(
  {
    employer: { type: Schema.Types.ObjectId, ref: 'Employer', required: true },
    jobseeker: { type: Schema.Types.ObjectId, ref: 'JobSeeker', required: true },
    messages: { type: [messageSchema], default: [] },
    isBlocked: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export const Chat = model<ChatDoc>('Chat', chatSchema);
