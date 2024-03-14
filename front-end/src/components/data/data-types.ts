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

export interface CurrentUser {
  name: string;
  email: string;
  password: string;
  pic?: string;
  macroTarget: MacroTarget;
  savedFoods: CustomFoods[];
}

export interface MacroTarget {
  calories?: number;
  carbs?: number;
  fats?: number;
  protein?: number;
}

export interface CustomFoodInfo {
  calories: string;
   protein?: string;
  fats?: string;
  carbs?: string;
  name: string;
  quantity: number;
  measurement: string;
  referenceId?: string;
}

export interface CustomFoods {
  foodInfo: CustomFoodInfo;
  _id: string;
  createdAt?: Date;
  updatedAt?: Date;
}
