export interface FoodInfo {
  calories: string;
  protein?: string;
  fats?: string;
  carbs?: string;
  meal?: string;
  name?: string;
  quantity?: number;
  measurement?: string;
  referenceId?: string;
}

type mealtimes = "Breakfast" | "Lunch" | "Dinner";
export interface FoodLogEntry {
  foodInfo: FoodInfo;
  createdAt?: Date;
  _id: string;
  updatedAt?: Date;
}

export interface UserFoodLog {
  user: string;
  date: string;
  foodLog: FoodLogEntry[];
  isSubmitted: boolean;
}
