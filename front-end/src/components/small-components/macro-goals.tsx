import React, { useEffect, useState } from "react";
import { FoodLogEntry } from "../data/data-types";
import { useAuthContext } from "../../context/AuthContext";

const MacroTarget: React.FC<{ data: FoodLogEntry[]|null }> = ({ data }) => {
  const [calorieTarget, setCalorieTarget] = useState(0);
  const [proteinTarget, setProteinTarget] = useState(0);
  const [fatTarget, setFatTarget] = useState(0);
  const [carbsTarget, setCarbsTarget] = useState(0);

  const { user } = useAuthContext();

  useEffect(() => {
    if (user) {
      setCalorieTarget(1);
    }
  }, [user, data]);

  return (
    <div className="flex gap-1">
      <div className="w-16">
        <span>Target:</span>
      </div>
      <div className="w-32">
        <span>{calorieTarget}</span>
      </div>
      <div className="w-32">
        <span>{proteinTarget}</span>
      </div>
      <div className="w-32">
        <span>{fatTarget}</span>
      </div>
      <div className="w-32">
        <span>{carbsTarget}</span>
      </div>
    </div>
  );
};

export default MacroTarget;
