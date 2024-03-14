import React, { useState } from "react";
import { CustomFoods } from "../data/data-types";
import { Select } from "antd";
import axios from "axios";
import { submitFoodtoLog } from "../hooks/userGetUserFoods";
import { FoodInfo } from "../data/data-types";

const SelectedItem: React.FC<{
  data: CustomFoods;
  submissionDate: string;
  refetch: any;
  cb: any;
}> = ({ data, submissionDate, refetch, cb }) => {
  const [amount, setAmount] = useState(data.foodInfo.quantity.toString());
  const [ratio, setRatio] = useState(1);
  const [calories, setCalories] = useState(0);
  const [protein, setProtein] = useState(0);
  const [carbs, setCarbs] = useState(0);
  const [fats, setFats] = useState(0);
  const [meal, setMeal] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    setAmount(inputValue);
    if (inputValue === "") {
      return;
    }
    const percentage = Number(inputValue) / data.foodInfo.quantity;
    setRatio(percentage);
    setCalories(Math.round(percentage * Number(data.foodInfo.calories)));

    if (data.foodInfo.protein)
      setProtein(Math.round(percentage * Number(data.foodInfo.protein)));
    if (data.foodInfo.fats)
      setFats(Math.round(percentage * Number(data.foodInfo.fats)));
    if (data.foodInfo.carbs)
      setCarbs(Math.round(percentage * Number(data.foodInfo.carbs)));
  };
  const handleChangeMeal = (value: string) => {
    setMeal(value);
  };

  const resetFields = () => {
    setAmount(data.foodInfo.quantity.toString());
    setCalories(0);
    setProtein(0);
    setCarbs(0);
    setFats(0);
    setMeal("");
  };

  const submitFoodLog = async () => {
    const s_calories =
      calories !== 0 ? calories.toString() : data.foodInfo.calories;
    const s_quantity = amount !== "" ? Number(amount) : data.foodInfo.quantity;

    const s_protein =
      protein !== 0 ? protein.toString() : data.foodInfo.protein;
    const s_carbs = carbs !== 0 ? carbs.toString() : data.foodInfo.carbs;
    const s_fats = fats !== 0 ? fats.toString() : data.foodInfo.fats;

    const submissionEntry: FoodInfo = {
      name: data.foodInfo.name,
      measurement: data.foodInfo.measurement,
      quantity: s_quantity,
      calories: s_calories,
      referenceId: data._id,
    };

    if (s_protein) submissionEntry.protein = s_protein;
    if (s_carbs) submissionEntry.carbs = s_carbs;
    if (s_fats) submissionEntry.fats = s_fats;
    if (meal !== "") submissionEntry.meal = meal;

    console.log("submissionEntry", submissionEntry);
    console.log("submission", submissionDate);
    await submitFoodtoLog(submissionEntry,submissionDate)

    resetFields();
    refetch()
    cb()

    try {
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div>Selected Food:</div>
      <div>{data.foodInfo.name}</div>
      <input
        className="w-14"
        value={amount}
        type="number"
        onChange={handleChange}
      />
      <span>{data.foodInfo.measurement}</span>
      <button className="ml-5 border border-black px-2" onClick={resetFields}>
        Reset
      </button>
      <div className="flex">
        <div className="w-16">Calories</div>
        <div className="w-16">Protein</div>
        <div className="w-16">carbs</div>
        <div className="w-16">Fats</div>
      </div>
      <div className="flex ">
        <div className="w-16">
          {amount === "" ||
          amount === data.foodInfo.quantity.toString() ||
          calories === 0
            ? data.foodInfo.calories
            : calories}
        </div>
        <div className="w-16">
          {amount === "" ||
          amount === data.foodInfo.quantity.toString() ||
          protein === 0
            ? data.foodInfo.protein
            : protein !== 0
            ? protein
            : "-"}
        </div>
        <div className="w-16">
          {amount === "" ||
          amount === data.foodInfo.quantity.toString() ||
          carbs === 0
            ? data.foodInfo.carbs
            : carbs !== 0
            ? carbs
            : "-"}
        </div>
        <div className="w-16">
          {amount === "" ||
          amount === data.foodInfo.quantity.toString() ||
          fats === 0
            ? data.foodInfo.fats
            : fats !== 0
            ? fats
            : "-"}
        </div>
        <Select
          value={meal}
          //   style={{ width: 120 }}
          className="w-24 h-6"
          onChange={handleChangeMeal}
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
      <button onClick={submitFoodLog}>Add</button>
    </>
  );
};

export default SelectedItem;
