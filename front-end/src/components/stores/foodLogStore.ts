import { action, makeObservable, observable } from "mobx";
import { Macros } from "../small-components/macro-totals";

class UserFoodLogStore {
  @observable editedFoodName: string;
  @observable editedCalories: string;
  @observable editedProtein: string;
  @observable editedFats: string;
  @observable editedCarbs: string;
  @observable editedMeal: string;
  @observable totalMacros: Macros;

  constructor() {
    this.editedFoodName = "";
    this.editedCalories = "";
    this.editedProtein = "";
    this.editedCarbs = "";
    this.editedFats = "";
    this.editedMeal = "";
    this.totalMacros = {
      protein: 0,
      calories: 0,
      fats: 0,
      carbs: 0,
    };

    makeObservable(this);
  }

  @action setEditedFoodName = (currentValue: string, newValue: string) => {
    if (currentValue.trim() !== newValue.trim()) {
      this.editedFoodName = newValue;
    } else {
      this.editedFoodName = "";

      return;
    }
  };

  @action setEditedCalories = (currentValue: string, newValue: string) => {
    if (currentValue.trim() !== newValue.trim()) {
      this.editedCalories = newValue;
  
    } else {
      this.editedCalories = "";
     
    }

  };
  @action setEditedProtein = (currentValue: string, newValue: string) => {
    if (currentValue.trim() !== newValue.trim()) {
      this.editedProtein = newValue;
    } else {
      this.editedProtein = "";
      return;
    }
  };
  @action setEditedCarbs = (currentValue: string, newValue: string) => {
    if (currentValue.trim() !== newValue.trim()) {
      this.editedCarbs = newValue;
    } else {
      this.editedCarbs = "";
      return;
    }
  };
  @action setEditedFats = (currentValue: string, newValue: string) => {
    if (currentValue.trim() !== newValue.trim()) {
      this.editedFats = newValue;
    } else {
      this.editedFats = "";
      return;
    }
  };

  @action setEditedMeals = (currentValue: string, newValue: string) => {
    if (currentValue.trim() !== newValue.trim()) {
      this.editedMeal = newValue;
    } else {
      this.editedMeal = "";
      return;
    }
  };

  @action setTotalMacros = (value: Macros) => {
    this.totalMacros = value;
  };

  @action resetTotalMacros = () => {
    this.totalMacros = {
      protein: 1,
      calories: 1,
      fats: 1,
      carbs: 1,
    };
  };

  @action resetEditingFields = () => {
    this.editedCalories = "";
    this.editedCarbs = "";
    this.editedFats = "";
    this.editedProtein = "";

    this.editedFoodName = "";
    this.editedMeal = "";
  };
}

const UserFoodStore = new UserFoodLogStore();

export default UserFoodStore;
export type SetPropertyFunction = (
  currentValue: string,
  newValue: string
) => void;
