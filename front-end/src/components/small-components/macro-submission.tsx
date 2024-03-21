import React, { useState } from "react";
import CustomInput from "../custom-components/custom-input";
import { postConfig } from "../helpers";
import axios from "axios";
import { useAuthContext } from "../../context/AuthContext";
import { FoodLogEntry } from "../data/data-types";
import FoodInputStore from "../stores/macroInputStore";
import { FoodInfo } from "../data/data-types";
import { message, Select } from "antd";
import InputCalculator from "../custom-components/input-calculator";

const MacroSubmissionForm: React.FC<{
  refetch: any;
  submissionDate: string;
}> = ({ refetch, submissionDate }) => {
  const { user } = useAuthContext();
  const [meal, setMeal] = useState("");
  const [name, setName] = useState("");
  
  const [protein, setProtein] = useState("");
  const [evalprotein, setEvalProtein] = useState("");

  const [fats, setFats] = useState("");
  const [evalfats, setEvalFats] = useState("");

  const [carbs, setCarbs] = useState("");
  const [evalcarbs, setEvalCarbs] = useState("");

  const [calories, setCalories] = useState("");
  const [evalcalories, setEvalCalories] = useState("");

  const [isError, setisError] = useState(false);
  
  const [messageApi, contextHolder] = message.useMessage();

  const errorMessage = (message = "") => {
    messageApi.open({
      type: "warning",
      content: message,
      duration: 3,
    });
  };

  const handleChange = (value: string) => {
    setMeal(value);
  };

  const submitFoodLog = async () => {
    const url = "/api/foodlog";

    if (calories.trim() === "") {
      errorMessage("Must enter calories");
    }

    if (user) {
      const foodData: FoodInfo = {
        calories: calories,
      };
      if (name.trim() !== "") foodData.name = name;
      if (meal.trim() !== "") foodData.meal = meal;
      if (fats.trim() !== "") foodData.fats = fats;
      if (carbs.trim() !== "") foodData.carbs = carbs;
      if (protein.trim() !== "") foodData.protein = protein;

      try {
        const postFood = await axios.post(
          url,
          { foodInfo: foodData, date: submissionDate },
          postConfig(user)
        );
        refetch();

        setProtein("");
        setEvalProtein("")
        setMeal("");
        setName("");
        setFats("");
        setEvalFats("");
        setEvalCarbs("");
        setCarbs("");
        setEvalCalories("");
        setCalories("");
      } catch (error) {
        errorMessage("Unable to add entry");
        console.log(error);
      }
    } else {
      return;
    }
  };

  return (
    <div className="flex gap-1">
      <Select
        value={meal}
        style={{ width: 120 }}
        onChange={handleChange}
        options={[
          {
            value: "Breakfast",
            label: "Breakfast",
          },
          {
            value: "Lunch",
            label: "Lunch",
          },
          {
            value: "Dinner",
            label: "Dinner",
          },
        ]}
      />
      <CustomInput
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
        type="text"
      />
      <InputCalculator
        value={calories}
        evalue={evalcalories}
        className="w-16"
        label="Calories"
        cbError={(state) => setisError(state)}
        cb={(state) => setCalories(state)}
        cbEval={(state) => setEvalCalories(state)}
      />

      <InputCalculator
        className="w-16"
        value={carbs}
        evalue={evalcarbs}
        label="Carbs"
        cbError={(state) => setisError(state)}
        cb={(state) => setCarbs(state)}
        cbEval={(state) => setEvalCarbs(state)}
      />
      <InputCalculator
        value={fats}
        evalue={evalfats}
        className="w-16"
        label="Fats"
        cbError={(state) => setisError(state)}
        cb={(state) => setFats(state)}
        cbEval={(state) => setEvalFats(state)}
      />
      <InputCalculator
        value={protein}
        evalue={evalprotein}
        className="w-16"
        label="Protein"
        cbError={(state) => setisError(state)}
        cb={(state) => setProtein(state)}
        cbEval={(state) => setEvalProtein(state)}
      />

      <button
        disabled={calories.trim() === "" || isError}
        onClick={() => {
          submitFoodLog();
        }}
      >
        Add
      </button>
    </div>
  );
};

export default MacroSubmissionForm;
