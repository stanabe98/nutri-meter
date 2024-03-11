import React, { useEffect } from "react";
import { FoodLogEntry } from "../data/data-types";
import UserFoodStore from "../stores/foodLogStore";
export interface Macros {
  protein: number;
  calories: number;
  fats: number;
  carbs: number;
}

const MacroTotals: React.FC<{ tableData: FoodLogEntry[] | null }> = ({
  tableData,
}) => {
  const sumMacros = tableData
    ? tableData.reduce(
        (acc: Macros, current: FoodLogEntry) => {
          acc.calories += Number(eval(current.foodInfo.calories));
          acc.protein += Number(eval(current.foodInfo.protein ?? "0"));
          acc.carbs += Number(eval(current.foodInfo.carbs ?? "0"));
          acc.fats += Number(eval(current.foodInfo.fats ?? "0"));
          return acc;
        },
        { calories: 0, fats: 0, protein: 0, carbs: 0 }
      )
    : null;

  useEffect(() => {
    console.log("running effect")
    if (tableData) {
        
      const defaultVal: Macros = { calories: 1, fats: 1, protein: 1, carbs: 1 };
      console.log("sumMacros", sumMacros)
      UserFoodStore.setTotalMacros(sumMacros ?? defaultVal);
      console.log("total macros",UserFoodStore.totalMacros.calories)
    }
  }, [tableData, sumMacros]);

  return (
    <div className="flex gap-2">
      <div className="w-48">
        <span>Totals:</span>
      </div>
      <div className="w-32">
        <span>{sumMacros?.calories ?? 0}</span>
      </div>
      <div className="w-32">
        <span>{sumMacros?.carbs ?? 0}</span>
      </div>
      <div className="w-32">
        <span>{sumMacros?.fats ?? 0}</span>
      </div>
      <div className="w-32">
        <span>{sumMacros?.protein ?? 0}</span>
      </div>
    </div>
  );
};

export default MacroTotals;
