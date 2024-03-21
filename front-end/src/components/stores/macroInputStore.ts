import {
  action,
  makeObservable,
  observable,
  runInAction,
  reaction,
} from "mobx";

class MacroInputStore {
  @observable calories: string;
  @observable protein: string;
  @observable carbs: string;
  @observable fats: string;

  @observable evalcalories: string;
  @observable evalprotein: string;
  @observable evalcarbs: string;
  @observable evalfats: string;

  constructor() {
    this.calories = "";
    this.protein = "";
    this.carbs = "";
    this.fats = "";
    this.evalcalories = "";
    this.evalcarbs = "";
    this.evalfats = "";
    this.evalprotein = "";
    makeObservable(this);

    reaction(
      () =>
        Number(this.evalcarbs) * 4 +
        Number(this.evalprotein) * 4 +
        Number(this.evalfats) * 9, // The expression to observe
      (sum) => {
        if (sum > Number(this.evalcalories)) {
          const val = Math.round(sum);
          this.evalcalories = val.toString();
          this.calories = val.toString();
        }
      }
    );
  }

  @action setCalories = (value: string) => {
    this.calories = value;
  };

  @action setEvalCalories = (value: string) => {
    this.evalcalories = value;
  };

  @action setProtein = (value: string) => {
    this.protein = value;
  };
  @action setEvalProtein = (value: string) => {
    this.evalprotein = value;
  };

  @action setCarbs = (value: string) => {
    this.carbs = value;
  };

  @action setEvalCarbs = (value: string) => {
    this.evalcarbs = value;
  };

  @action setFats = (value: string) => {
    this.fats = value;
  };

  @action setEvalFats = (value: string) => {
    this.evalfats = value;
  };

  @action resetMacros = () => {
    this.calories = "";
    this.protein = "";
    this.carbs = "";
    this.fats = "";

    this.evalcalories = "";
    this.evalprotein = "";
    this.evalcarbs = "";
    this.evalfats = "";
  };
}

const FoodInputStore = new MacroInputStore();
export default FoodInputStore;
