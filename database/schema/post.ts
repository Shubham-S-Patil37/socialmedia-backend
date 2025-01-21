import mongoose, { Schema, Document } from 'mongoose';

export interface IPost extends Document {
  _id: string;
  userId: string
  caption: string;
  media: string;
  type: string;
  createdBy: string;
  updatedBy: string;
  isActive: boolean;
}

const postSchema = new Schema<IPost>({
  userId: { type: String, required: true },
  caption: { type: String, required: true },
  media: { type: String, required: true, unique: true },
  type: { type: String, required: true, unique: true },
  createdBy: { type: String },
  updatedBy: { type: String },
  isActive: { type: Boolean, required: true },
}, {
  timestamps: true
});


const PostModel = mongoose.model<IPost>('Post', postSchema);
export { PostModel };