import mongoose, { Document } from "mongoose";

export interface FoodInfo extends Document {
  calories: number;
  protein?: number;
  fats?: number;
  carbs?: number;
  meal?: "Breakfast" | "Lunch" | "Dinner";
  name?: string;
}

export interface FoodLogEntry extends Document {
  foodInfo: FoodInfo;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserFoodLog {
  user: mongoose.Schema.Types.ObjectId;
  date: string;
  foodLog: FoodLogEntry[];
  isSubmitted: boolean;
}

const foodLogEntrySchema = new mongoose.Schema<FoodLogEntry>(
  {
    foodInfo: {
      calories: { type: Number, required: true },
      carbs: { type: Number, required: false },
      fats: { type: Number, required: false },
      protein: { type: Number, required: false },

      meal: { type: String, required: false },
    },
  },
  { timestamps: true }
);

function isValidDate(dateString: string): boolean {
  const regex = /^\d{2}-\d{2}-\d{4}$/; // dd-mm-yyyy format
  return regex.test(dateString);
}

const userFoodLogSchema = new mongoose.Schema<UserFoodLog>({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserCredentials",
    required: true,
  },
  date: {
    type: String,
    required: true,
    validate: {
      validator: function (value: string) {
        return isValidDate(value);
      },
      message: "Date format should be dd/mm/yyyy",
    },
  },
  foodLog: [foodLogEntrySchema],
  isSubmitted: { type: Boolean, required: false, default: false },
});

const UserFoodLogModel = mongoose.model<UserFoodLog>(
  "UserFoodLog",
  userFoodLogSchema
);

export default UserFoodLogModel;
