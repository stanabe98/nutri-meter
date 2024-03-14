import mongoose, { Document } from "mongoose";

export interface FoodInfo extends Document {
  calories: string;
  protein?: string;
  fats?: string;
  carbs?: string;
  meal?: "Breakfast" | "Lunch" | "Dinner";
  name?: string;
  quantity?: number;
  measurement?: string;
  referenceId?: string;
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
  totalMacros: TotalMacros;
}

export interface TotalMacros {
  totalProtein: number;
  totalCalories: number;
  totalFats: number;
  totalCarbs: number;
}

const foodLogEntrySchema = new mongoose.Schema<FoodLogEntry>(
  {
    foodInfo: {
      calories: { type: String, required: true },
      carbs: { type: String, required: false },
      fats: { type: String, required: false },
      protein: { type: String, required: false },
      name: { type: String, required: false },
      meal: { type: String, required: false },
      quantity: { type: Number, required: false },
      measurement: { type: String, required: false },
      referenceId: { type: String, required: false },
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
  totalMacros: {
    totalProtein: { type: Number },
    totalCalories: { type: Number },
    totalFats: { type: Number },
    totalCarbs: { type: Number },
  },
});

userFoodLogSchema.pre<UserFoodLog>("save", function (next) {
  let totalProtein = 0;
  let totalCalories = 0;
  let totalFats = 0;
  let totalCarbs = 0;

  console.log("running this")
  // Calculate totals from each food log entry
  this.foodLog.forEach((entry) => {
    if (entry.foodInfo.calories)
      totalCalories += Number(eval(entry.foodInfo.calories));
    if (entry.foodInfo.protein)
      totalProtein += Number(eval(entry.foodInfo.protein));
    if (entry.foodInfo.carbs) totalCarbs += Number(eval(entry.foodInfo.carbs));
    if (entry.foodInfo.fats) totalFats += Number(eval(entry.foodInfo.fats));
  });

  // Assign totals to totalMacros property
  this.totalMacros = {
    totalProtein: Math.round(totalProtein),
    totalCalories: Math.round(totalCalories),
    totalFats: Math.round(totalFats),
    totalCarbs: Math.round(totalCarbs),
  };

  next();
});

// userFoodLogSchema.post<UserFoodLog>("updateOne", function (doc,next) {
//   let totalProtein = 0;
//   let totalCalories = 0;
//   let totalFats = 0;
//   let totalCarbs = 0;

//   console.log("running this");
  
//   this.foodLog.forEach((entry) => {
//     if (entry.foodInfo.calories)
//       totalCalories += Number(eval(entry.foodInfo.calories));
//     if (entry.foodInfo.protein)
//       totalProtein += Number(eval(entry.foodInfo.protein));
//     if (entry.foodInfo.carbs) totalCarbs += Number(eval(entry.foodInfo.carbs));
//     if (entry.foodInfo.fats) totalFats += Number(eval(entry.foodInfo.fats));
//   });

  
//   this.totalMacros = {
//     totalProtein: Math.round(totalProtein),
//     totalCalories: Math.round(totalCalories),
//     totalFats: Math.round(totalFats),
//     totalCarbs: Math.round(totalCarbs),
//   };

//   next();
// });



const UserFoodLogModel = mongoose.model<UserFoodLog>(
  "UserFoodLog",
  userFoodLogSchema
);


export default UserFoodLogModel;
