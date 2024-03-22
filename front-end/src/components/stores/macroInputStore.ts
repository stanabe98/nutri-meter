import {
  action,
  makeObservable,
  observable,
  runInAction,
  reaction,
  computed,
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
      () => ({
        car: this.evalcarbs,
        pro: this.evalprotein,
        fat: this.evalfats,
      }),
      ({ car, pro, fat }) => {
        // const carbsTot = isNaN(Number(car)) ? 0 : Number(car) * 4;
        // const protsTot = isNaN(Number(pro)) ? 0 : Number(pro) * 4;
        // const fatsTot = isNaN(Number(fat)) ? 0 : Number(fat) * 9;
        // const calTot = isNaN(Number(this.evalcalories))
        //   ? 0
        //   : Number(this.evalcalories);

        // const total = carbsTot + protsTot + fatsTot;

        // const rounded = Math.round(total);
        if (this.totalMacroCount > this.totalCalorieCount) {
          this.evalcalories = this.totalMacroCount.toString();
          this.calories = this.totalMacroCount.toString();
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

  @computed get totalMacroCount() {
    const carbsTot = isNaN(Number(this.evalcarbs))
      ? 0
      : Number(this.evalcarbs) * 4;
    const protsTot = isNaN(Number(this.evalprotein))
      ? 0
      : Number(this.evalprotein) * 4;
    const fatsTot = isNaN(Number(this.evalfats))
      ? 0
      : Number(this.evalfats) * 9;
    return Math.round(carbsTot + protsTot + fatsTot);
  }

  @computed get totalCalorieCount() {
    const calTot = isNaN(Number(this.evalcalories))
      ? 0
      : Number(this.evalcalories);

    return calTot;
  }
}

const FoodInputStore = new MacroInputStore();
export default FoodInputStore;
