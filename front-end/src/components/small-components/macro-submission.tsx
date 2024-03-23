import React, { useState } from "react";
import { observer } from "mobx-react";
import CustomInput from "../custom-components/custom-input";
import Button from "@mui/material/Button";
import { postConfig } from "../helpers";
import axios from "axios";
import { useAuthContext } from "../../context/AuthContext";
import { FoodLogEntry } from "../data/data-types";
import FoodInputStore from "../stores/macroInputStore";
import { FoodInfo } from "../data/data-types";
import { message, Select } from "antd";
import InputCalculator from "../custom-components/input-calculator";
import "./styles.css";

const MacroSubmissionForm: React.FC<{
  refetch: any;
  submissionDate: string;
}> = ({ refetch, submissionDate }) => {
  const { user } = useAuthContext();
  const [meal, setMeal] = useState("");
  const [name, setName] = useState("");
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

    if (FoodInputStore.calories.trim() === "") {
      errorMessage("Must enter calories");
    }

    if (user) {
      let calorieSubmission = FoodInputStore.calories;
      if (FoodInputStore.totalMacroCount > FoodInputStore.totalCalorieCount) {
        calorieSubmission = FoodInputStore.totalMacroCount.toString();
        FoodInputStore.setCalories(calorieSubmission);
        FoodInputStore.setEvalCalories(calorieSubmission);
      }
      const foodData: FoodInfo = {
        calories: calorieSubmission,
      };
      if (name.trim() !== "") foodData.name = name;
      if (meal.trim() !== "") foodData.meal = meal;
      if (FoodInputStore.fats.trim() !== "")
        foodData.fats = FoodInputStore.fats;
      if (FoodInputStore.carbs.trim() !== "")
        foodData.carbs = FoodInputStore.carbs;
      if (FoodInputStore.protein.trim() !== "")
        foodData.protein = FoodInputStore.protein;

      try {
        const postFood = await axios.post(
          url,
          { foodInfo: foodData, date: submissionDate },
          postConfig(user)
        );
        refetch();
        FoodInputStore.resetMacros();

        setMeal("");
        setName("");
      } catch (error) {
        errorMessage("Unable to add entry");
        console.log(error);
      }
    } else {
      return;
    }
  };

  return (
    <div className="flex gap-1 items-center">
      <div style={{ width: "12%" }} className="ml-8">
        <span className="block text-sm text-center">Meal</span>

        <Select
          className="select-meal h-8 drop-shadow-md"
          value={meal}
          style={{ width: "100%" }}
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
      </div>
      <div className=" text-center" style={{ width: "27%" }}>
        <span className="text-sm ">Name</span>
        <div>
          <CustomInput
            maxLength={30}
            moreStyles="h-8 drop-shadow-md"
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
          />
        </div>
      </div>
      <InputCalculator
        value={FoodInputStore.calories}
        evalue={FoodInputStore.evalcalories}
        className="w-16 h-8"
        label="Calories"
        cbError={(state) => setisError(state)}
        cb={(state) => FoodInputStore.setCalories(state)}
        cbEval={(state) => FoodInputStore.setEvalCalories(state)}
      />

      <InputCalculator
        className="w-16 h-8"
        value={FoodInputStore.carbs}
        evalue={FoodInputStore.evalcarbs}
        label="Carbs"
        cbError={(state) => setisError(state)}
        cb={(state) => FoodInputStore.setCarbs(state)}
        cbEval={(state) => FoodInputStore.setEvalCarbs(state)}
      />
      <InputCalculator
        value={FoodInputStore.fats}
        evalue={FoodInputStore.evalfats}
        className="w-16 h-8"
        label="Fats"
        cbError={(state) => setisError(state)}
        cb={(state) => FoodInputStore.setFats(state)}
        cbEval={(state) => FoodInputStore.setEvalFats(state)}
      />
      <InputCalculator
        value={FoodInputStore.protein}
        evalue={FoodInputStore.evalprotein}
        className="w-16 h-8"
        label="Protein"
        cbError={(state) => setisError(state)}
        cb={(state) => FoodInputStore.setProtein(state)}
        cbEval={(state) => FoodInputStore.setEvalProtein(state)}
      />

      <div className="mt-6">
        <Button
          className="h-8"
          variant="contained"
          sx={{
            backgroundColor: "var(--button-colour)",
            "&:hover": {
              backgroundColor: "var(--button-hover)", // Change color on hover
            },
          }}
          disabled={FoodInputStore.calories.trim() === "" || isError}
          onClick={() => {
            submitFoodLog();
          }}
        >
          Add
        </Button>
      </div>
    </div>
  );
};

export default observer(MacroSubmissionForm);
