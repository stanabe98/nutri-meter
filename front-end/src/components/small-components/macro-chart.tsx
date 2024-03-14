import React, { useState, useEffect } from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import UserFoodStore from "../stores/foodLogStore";
import { useNavigate } from "react-router-dom";
import { Macros } from "./macro-totals";
import { FoodLogEntry, TotalMacros } from "../data/data-types";

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

const MacroChart: React.FC<{ data: TotalMacros | null }> = ({ data }) => {
  const [chartData, setChartData] = useState<any>(defaultData);
  const navigate = useNavigate();

  useEffect(() => {
    const proteinPercentage = data
      ? (data.totalProtein * 4) / data.totalCalories
      : 1;

    console.log("percentage", proteinPercentage);
    const fatsPercentage = data ? (data.totalFats * 9) / data.totalCalories : 1;
    const carbsPercentage = data
      ? (data.totalCarbs * 4) / data.totalCalories
      : 1;

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
              ? `Protein ${data.totalProtein}g`
              : "Protein",
          },
          {
            id: 1,
            value: data ? Math.round(carbsPercentage * 100) : 1,
            label: data ? `Carbs ${data.totalCarbs}g` : "Carbs",
          },
          {
            id: 2,
            value: data ? Math.round(fatsPercentage * 100) : 1,
            label: data ? `Fats ${data.totalFats}g` : "Fats",
          },
          {
            id: 3,
            value: data ? Math.round(unaccountedPercentage) : 1,
            label: "Unaccounted",
          },
        ],
      },
    ]);
  }, [data, navigate]);

  return (
    <>
      <div className="text-center">Nutrition Chart</div>

      <PieChart series={chartData} width={400} height={200} />
    </>
  );
};

export default MacroChart;
