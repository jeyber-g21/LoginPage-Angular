import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  email: string;
  name: string;
  lastName: string;
  password: string;
}

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  lastName: { type: String, required: true },
  password: { type: String, required: true },
});

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);

export default User;
