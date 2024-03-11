import React, { useState, useEffect } from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import UserFoodStore from "../stores/foodLogStore";
import { useNavigate } from "react-router-dom";
import { Macros } from "./macro-totals";
import { FoodLogEntry } from "../data/data-types";

const defaultData = [
  {
    data: [
      {
        id: 0,
        value: 1,
        label: "Protein",
      },
      {
        id: 1,
        value: 1,
        label: "Carbs",
      },
      {
        id: 2,
        value: 1,
        label: "Fats",
      },
      {
        id: 3,
        value: 1,
        label: "Unaccounted",
      },
    ],
  },
];

const MacroChart: React.FC<{ data: FoodLogEntry[] | null }> = ({ data }) => {
  const [chartData, setChartData] = useState<any>(defaultData);
  const navigate = useNavigate();

  useEffect(() => {
    const proteinPercentage =
      (UserFoodStore.totalMacros.protein * 4) /
      UserFoodStore.totalMacros.calories;

    console.log("percentage", proteinPercentage, data && data[0].foodInfo);

    const fatsPercentage =
      (UserFoodStore.totalMacros.fats * 9) / UserFoodStore.totalMacros.calories;
    const carbsPercentage =
      (UserFoodStore.totalMacros.carbs * 4) /
      UserFoodStore.totalMacros.calories;
    const unaccountedPercentage =
      100 -
      (fatsPercentage * 100 + carbsPercentage * 100 + proteinPercentage * 100);

    setChartData([
      {
        data: [
          {
            id: 0,
            value: data ? Math.round(proteinPercentage * 100) : 1,
            label: data
              ? `Protein ${UserFoodStore.totalMacros.protein}g`
              : "Protein",
          },
          {
            id: 1,
            value: data ? Math.round(carbsPercentage * 100) : 1,
            label: data ? `Carbs ${UserFoodStore.totalMacros.carbs}g` : "Carbs",
          },
          {
            id: 2,
            value: data ? Math.round(fatsPercentage * 100) : 1,
            label: data ? `Fats ${UserFoodStore.totalMacros.fats}g` : "Fats",
          },
          {
            id: 3,
            value: data ? Math.round(unaccountedPercentage) : 1,
            label: "Unaccounted",
          },
        ],
      },
    ]);
  }, [UserFoodStore.totalMacros, data, navigate]);

  return (
    <>
      <div className="text-center">Macros percentage</div>

      <PieChart series={chartData} width={400} height={200} />
    </>
  );
};

export default MacroChart;
