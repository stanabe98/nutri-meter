import React, { useEffect, useState, useRef } from "react";
import { FoodLogEntry, MacroTarget, TotalMacros } from "../data/data-types";
import { useAuthContext } from "../../context/AuthContext";
import "./styles.css";

const NutrionTarget: React.FC<{
  data: TotalMacros | null;
  goalsData: MacroTarget | null;
}> = ({ data, goalsData }) => {
  const [calorieTarget, setCalorieTarget] = useState(0);
  const [caloriesRemaining, setCaloriesRemaining] = useState(0);

  const [proteinTarget, setProteinTarget] = useState(0);
  const [fatTarget, setFatTarget] = useState(0);
  const [carbsTarget, setCarbsTarget] = useState(0);
  const spanRef = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    setCaloriesRemaining(Number(spanRef.current?.innerText));
    console.log("ref text", spanRef.current?.innerText);
    console.log(Number(spanRef.current?.innerText) < 0);
    console.log("ref text", typeof spanRef.current?.innerText);
  }, [data]);

  return (
    <div className="info-container rounded-md">
      <div className="flex gap-1  ">
        <div className="w-32 text-center mb-1 rounded-md tally">
          <span>Total:</span>
        </div>
        <div className="w-16 text-center font-semibold">
          <span>{data?.totalCalories ?? 0}</span>
        </div>
        <div className="w-16 text-center font-semibold">
          <span>{data?.totalProtein ?? 0}</span>
        </div>
        <div className="w-16 text-center font-semibold">
          <span>{data?.totalFats ?? 0}</span>
        </div>
        <div className="w-16 text-center font-semibold">
          <span>{data?.totalCarbs ?? 0}</span>
        </div>
      </div>
      <div className="flex gap-1">
        <div className="w-32 text-center mb-1 bg-green-700 tally ">
          <span>Target:</span>
        </div>
        <div className="w-16 text-center font-semibold">
          <span>{goalsData?.calories ?? "-"}</span>
        </div>
        <div className="w-16 text-center font-semibold">
          <span>{goalsData?.protein ?? "-"}</span>
        </div>
        <div className="w-16 text-center font-semibold">
          <span>{goalsData?.fats ?? "-"}</span>
        </div>
        <div className="w-16 text-center font-semibold">
          <span>{goalsData?.carbs ?? "-"}</span>
        </div>
      </div>
      <div className="flex gap-1">
        <div className="w-32 text-center tally">
          <span>Remaining:</span>
        </div>
        <div
          className={`w-16 text-center bg-green-600 font-semibold transition-colors duration-300 ${
            caloriesRemaining > 0 ? "" : "bg-red-500"
          } rounded-sm`}
        >
          <span ref={spanRef}>
            {goalsData?.calories && data?.totalCalories
              ? goalsData?.calories - data?.totalCalories
              : goalsData?.calories && !data?.totalCalories
              ? goalsData?.calories - 0
              : "-"}
          </span>
        </div>
        <div
          className={`w-16 text-center font-semibold  bg-green-600 rounded-sm`}
        >
          <span>
            {goalsData?.protein && data?.totalProtein
              ? goalsData?.protein - data?.totalProtein
              : goalsData?.protein && !data?.totalProtein
              ? goalsData?.protein - 0
              : "-"}
          </span>
        </div>
        <div className="w-16 text-center font-semibold bg-green-600 rounded-sm">
          <span>
            {goalsData?.fats && data?.totalFats
              ? goalsData?.fats - data?.totalFats
              : goalsData?.fats && !data?.totalFats
              ? goalsData?.fats - 0
              : "-"}
          </span>
        </div>
        <div className="w-16 text-center font-semibold bg-green-600 rounded-sm">
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
        <div className="w-32 text-center"></div>
        <div className="w-16 text-center tally">
          <span>Calories</span>
        </div>
        <div className="w-16 text-center tally">
          <span>Protein</span>
        </div>
        <div className="w-16 text-center tally">
          <span>Fats</span>
        </div>
        <div className="w-16 text-center tally">
          <span>Carbs</span>
        </div>
      </div>
    </div>
  );
};

export default NutrionTarget;
