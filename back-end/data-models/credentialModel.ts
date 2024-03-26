import mongoose, { Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface User extends Document {
  name: string;
  email: string;
  password: string;
  pic?: string;
  macroTarget: MacroTarget;
  savedFoods: CustomFoods[];
  recentlyAdded?: RecentFoodInfo[];
  matchPassword(enteredPassword: string): Promise<boolean>;
}

export interface MacroTarget {
  calories?: number;
  carbs?: number;
  fats?: number;
  protein?: number;
}

export interface CustomFoodInfo extends Document {
  calories: string;
  protein?: string;
  fats?: string;
  carbs?: string;
  name: string;
  quantity: number;
  measurement: string;
  referenceId?: string;
}

export interface RecentFoodInfo extends CustomFoodInfo {
  createdAt: Date;
  updatedAt: Date;
}

export interface CustomFoods extends Document {
  foodInfo: CustomFoodInfo;
  createdAt?: Date;
  updatedAt?: Date;
}

const customFoodSchema = new mongoose.Schema<CustomFoods>(
  {
    foodInfo: {
      calories: { type: String, required: true },
      carbs: { type: String, required: false },
      fats: { type: String, required: false },
      protein: { type: String, required: false },
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      measurement: { type: String, required: false },
      referenceId: { type: String, required: false },
    },
  },
  { timestamps: true }
);

const recentFoodSchema = new mongoose.Schema<RecentFoodInfo>(
  {
    calories: { type: String, required: true },
    carbs: { type: String, required: false },
    fats: { type: String, required: false },
    protein: { type: String, required: false },
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    measurement: { type: String, required: true },
    referenceId: { type: String, required: false },
  },
  { timestamps: true }
);

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
  savedFoods: [customFoodSchema],
  recentlyAdded: {
    type: [recentFoodSchema],
    maxlength: 10,
    required: false,
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
  next();
});

const CredentialModel = mongoose.model<User>(
  "UserCredentials",
  credentialsSchema
);

export default CredentialModel;
