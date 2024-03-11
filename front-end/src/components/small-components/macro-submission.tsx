import React, { useState } from "react";
import CustomInput from "../custom-components/custom-input";
import { postConfig } from "../helpers";
import axios from "axios";
import { useAuthContext } from "../../context/AuthContext";
import { FoodLogEntry } from "../data/data-types";
import { FoodInfo } from "../data/data-types";
import { message, Select } from "antd";

const MacroSubmissionForm: React.FC<{
  refetch: any;
  submissionDate: string;
}> = ({ refetch, submissionDate }) => {
  const { user } = useAuthContext();
  const [protein, setProtein] = useState("");
  const [meal, setMeal] = useState("");
  const [name, setName] = useState("");
  const [fats, setFats] = useState("");
  const [carbs, setCarbs] = useState("");
  const [calories, setCalories] = useState("");
  const pattern = "[0-9+*/()-.]*";
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
        setMeal("");
        setName("");
        setFats("");
        setCarbs("");
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
      <CustomInput
        value={calories}
        moreStyles="w-16"
        onChange={(e) => setCalories(e.target.value)}
        placeholder="Calories"
        type="text"
        pattern={pattern}
      />
      <CustomInput
        value={carbs}
        moreStyles="w-16"
        onChange={(e) => setCarbs(e.target.value)}
        placeholder="Carbs"
        type="text"
        pattern={pattern}
      />
      <CustomInput
        value={fats}
        moreStyles="w-16"
        onChange={(e) => setFats(e.target.value)}
        placeholder="Fats"
        type="text"
        pattern={pattern}
      />
      <CustomInput
        onChange={(e) => setProtein(e.target.value)}
        value={protein}
        moreStyles="w-16"
        placeholder="Protein"
        type="text"
        pattern={pattern}
      />
      <button
        disabled={calories.trim() === ""}
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
