import { Schema, model, type Document, Types } from 'mongoose';
import bcrypt from 'bcrypt';
import { UserPlanSelectionDocument } from './UserPlan.js';


export interface UserDocument extends Document {
  _id: Types.ObjectId
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  savedPlans: UserPlanSelectionDocument[];
  isCorrectPassword(password: string): Promise<boolean>;
  homeCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<UserDocument>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+@.+\..+/, 'Must use a valid email address'],
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
    },
    // set savedHomes to be an array of data that adheres to the userHomeSelectionSchema
    savedPlans: [{ type: Schema.Types.ObjectId, ref: 'UserPlan'}],
  },
  // set this to use virtual below
  {
    toJSON: {
      virtuals: true,
    }, 
    timestamps: true
  }
);

// hash user password
userSchema.pre('save', async function (next) {
  if (this.isNew || this.isModified('password')) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }

  next();
});

// custom method to compare and validate password for logging in
userSchema.methods.isCorrectPassword = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};


const User = model<UserDocument>('User', userSchema);

export default User;
