import React, { useEffect, useState } from "react";
import { FoodLogEntry, MacroTarget, TotalMacros } from "../data/data-types";
import { useAuthContext } from "../../context/AuthContext";

const NutrionTarget: React.FC<{
  data: TotalMacros | null;
  goalsData: MacroTarget | null;
}> = ({ data, goalsData }) => {
  const [calorieTarget, setCalorieTarget] = useState(0);
  const [proteinTarget, setProteinTarget] = useState(0);
  const [fatTarget, setFatTarget] = useState(0);
  const [carbsTarget, setCarbsTarget] = useState(0);

  return (
    <>
      <div className="flex gap-1">
        <div className="w-32">
          <span>Total:</span>
        </div>
        <div className="w-16">
          <span>{data?.totalCalories ?? 0}</span>
        </div>
        <div className="w-16">
          <span>{data?.totalProtein ?? 0}</span>
        </div>
        <div className="w-16">
          <span>{data?.totalFats ?? 0}</span>
        </div>
        <div className="w-16">
          <span>{data?.totalCarbs ?? 0}</span>
        </div>
      </div>
      <div className="flex gap-1">
        <div className="w-32">
          <span>Target:</span>
        </div>
        <div className="w-16">
          <span>{goalsData?.calories ?? "-"}</span>
        </div>
        <div className="w-16">
          <span>{goalsData?.protein ?? "-"}</span>
        </div>
        <div className="w-16">
          <span>{goalsData?.fats ?? "-"}</span>
        </div>
        <div className="w-16">
          <span>{goalsData?.carbs ?? "-"}</span>
        </div>
      </div>
      <div className="flex gap-1">
        <div className="w-32">
          <span>Remaining:</span>
        </div>
        <div className="w-16">
          <span>
            {goalsData?.calories && data?.totalCalories
              ? goalsData?.calories - data?.totalCalories
              : goalsData?.calories && !data?.totalCalories
              ? goalsData?.calories - 0
              : "-"}
          </span>
        </div>
        <div className="w-16">
          <span>
            {goalsData?.protein && data?.totalProtein
              ? goalsData?.protein - data?.totalProtein
              : goalsData?.protein && !data?.totalProtein
              ? goalsData?.protein - 0
              : "-"}
          </span>
        </div>
        <div className="w-16">
          <span>
            {goalsData?.fats && data?.totalFats
              ? goalsData?.fats - data?.totalFats
              : goalsData?.fats && !data?.totalFats
              ? goalsData?.fats - 0
              : "-"}
          </span>
        </div>
        <div className="w-16">
          <span>
            {goalsData?.carbs && data?.totalCarbs
              ? goalsData?.carbs - data?.totalCarbs
              : goalsData?.carbs && !data?.totalCarbs
              ? goalsData?.carbs - 0
              : "-"}
          </span>
        </div>
      </div>
      <div className="flex gap-1">
        <div className="w-32"></div>
        <div className="w-16">
          <span>Calories</span>
        </div>
        <div className="w-16">
          <span>Protein</span>
        </div>
        <div className="w-16">
          <span>Fats</span>
        </div>
        <div className="w-16">
          <span>Carbs</span>
        </div>
      </div>
    </>
  );
};

export default NutrionTarget;
