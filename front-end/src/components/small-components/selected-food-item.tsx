import React, { useState } from "react";
import { CustomFoods } from "../data/data-types";
import { Button } from "@mui/material";
import { RestartAlt, ArrowBack } from "@mui/icons-material";
import { Select } from "antd";
import axios from "axios";
import "./styles.css";
import { submitFoodtoLog } from "../hooks/userGetUserFoods";
import { FoodInfo } from "../data/data-types";
import { Divider } from "@mui/material";
import "../custom-components/custom-input.css";

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
      setCalories(Number(data.foodInfo.calories));
      if (data.foodInfo.protein) setProtein(Number(data.foodInfo.protein));
      if (data.foodInfo.fats) setFats(Number(data.foodInfo.fats));
      if (data.foodInfo.carbs) setCarbs(Number(data.foodInfo.carbs));

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
    console.log("cak", s_calories);

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
    await submitFoodtoLog(submissionEntry, submissionDate);

    resetFields();
    refetch();
    cb();

    try {
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="submission-form">
      <div className="font-semibold text-center pt-4 pb-4">
        <span>{data.foodInfo.name}</span>
      </div>

      <div className="flex justify-center mt-1">
        <span>Per</span>

        <input
          className="w-12 mx-1 pl-1 adjust-input drop-shadow-md"
          min={data.foodInfo.quantity >= 10 ? 1 : 0.1}
          step={data.foodInfo.measurement === "grams" ? 1 : 0.1}
          value={amount}
          onKeyDown={(e: any) => {
            const key = e.key;
            const allowedKeys = [
              "Backspace",
              "Delete",
              "ArrowLeft",
              "ArrowRight",
              "Tab",
            ];
            if (
              !allowedKeys.includes(key) &&
              (isNaN(Number(key)) || Number(e.target.value + key) > 1000)
            ) {
              e.preventDefault();
            }
          }}
          type="number"
          onChange={handleChange}
        />
        <span>{data.foodInfo.measurement}</span>
        <button
          style={{ width: "20px" }}
          className="reset-btn px-0 ml-2"
          onClick={resetFields}
        >
          <RestartAlt />
        </button>
      </div>
      <div className="flex justify-center font-semibold my-4 ">
        <div
          style={{ backgroundColor: "var(--header-colour)" }}
          className="flex w-96 border-b border-gray-400 drop-shadow-md"
        >
          <div className=" text-center   w-16 mr-1">Calories</div>
          <div className=" text-center  mr-1  w-16">Protein</div>
          <div className=" text-center mr-1 w-16">Carbs</div>
          <div className=" text-center  mr-1 w-16">Fats</div>
          <div className="  text-center   w-24">Meal</div>
        </div>
      </div>

      <div className="flex justify-center mt-1 font-semibold ">
        <div className="text-center border-b border-gray-400 mr-1 w-16">
          {amount === "" ||
          amount === data.foodInfo.quantity.toString() ||
          calories === 0
            ? data.foodInfo.calories
            : calories}
        </div>
        <div className="border-b  text-center border-gray-400 mr-1 w-16">
          {amount === "" ||
          amount === data.foodInfo.quantity.toString() ||
          protein === 0
            ? data.foodInfo.protein
            : protein !== 0
            ? protein
            : "-"}
        </div>
        <div className="border-b text-center border-gray-400 mr-1 w-16">
          {amount === "" ||
          amount === data.foodInfo.quantity.toString() ||
          carbs === 0
            ? data.foodInfo.carbs
            : carbs !== 0
            ? carbs
            : "-"}
        </div>
        <div className="border-b text-center border-gray-400 mr-1 w-16">
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
          className="w-24 h-6 drop-shadow-md"
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
      <div className="flex gap-2 justify-center mt-5">
        <button className="px-2 back-btn rounded-lg" onClick={cb}>
          <ArrowBack />
        </button>
        <button
          className="px-2 mr-2 add-btn rounded-lg font-semibold"
          onClick={submitFoodLog}
        >
          ADD
        </button>
      </div>
    </div>
  );
};

export default SelectedItem;
