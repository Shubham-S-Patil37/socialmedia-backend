import mongoose, { Schema, Document } from 'mongoose';

export interface IConnection extends Document {
  _id: string;
  userId: string
  friendId: string;
  // media: string;
  createdBy: string;
  updatedBy: string;
  isActive: boolean;
}

const connectionSchema = new Schema<IConnection>({
  userId: { type: String, required: true },
  friendId: { type: String, required: true },
  createdBy: { type: String },
  updatedBy: { type: String },
  isActive: { type: Boolean, required: true },
}, {
  timestamps: true
});


const ConnectionModel = mongoose.model<IConnection>('Connection', connectionSchema);
export { ConnectionModel };