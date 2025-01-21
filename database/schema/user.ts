import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  mobileNumber: string;
  password: string;
  birthDate: string;
  profilePic: string;
  bio: string;
  createdBy: string;
  updatedBy: string;
  isActive: boolean;
  contacts: number
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobileNumber: { type: String, required: false },
  password: { type: String, required: true },
  birthDate: { type: String },
  profilePic: { type: String },
  bio: { type: String },
  createdBy: { type: String },
  updatedBy: { type: String },
  isActive: { type: Boolean, required: true },
}, {
  timestamps: true
});


const UserModel = mongoose.model<IUser>('User', userSchema);
export { UserModel };
