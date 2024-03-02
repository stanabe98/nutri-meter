import mongoose, { Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface User extends Document {
  name: string;
  email: string;
  password: string;
  pic?: string;
  macroTarget: MacroTarget;
  matchPassword(enteredPassword: string): Promise<boolean>;
}

export interface MacroTarget {
  calories?: number;
  carbs?: number;
  fats?: number;
  protein?: number;
}

const credentialsSchema = new mongoose.Schema<User>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  pic: {
    type: String,
    required: false,
    default:
      "https://t4.ftcdn.net/jpg/00/64/67/27/360_F_64672736_U5kpdGs9keUll8CRQ3p3YaEv2M6qkVY5.jpg",
  },
  macroTarget: {
    type: {
      calories: { type: Number, required: false },
      carbs: { type: Number, required: false },
      fats: { type: Number, required: false },
      protein: { type: Number, required: false },

    },
    default: {},
    required: false,
    _id: false,
  },
});

credentialsSchema.methods.matchPassword = async function (
  enteredPassword: string
) {
  return await bcrypt.compare(enteredPassword, this.password);
};

credentialsSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next()
});




const CredentialModel = mongoose.model<User>(
  "UserCredentials",
  credentialsSchema
);

export default CredentialModel;
