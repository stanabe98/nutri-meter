import React, { useState } from "react";
import { RecentFoodInfo, FoodInfo } from "../data/data-types";
import { RestartAlt, ArrowBack } from "@mui/icons-material";
import { Select } from "antd";
import { submitFoodtoLog } from "../hooks/userGetUserFoods";

const SelectedRecent: React.FC<{
  date: string;
  selectedFood: RecentFoodInfo;
  cb: any;
  refetch: any;
}> = ({ date, selectedFood, cb, refetch }) => {
  const [amount, setAmount] = useState(selectedFood.quantity.toString());
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
      setCalories(Number(selectedFood.calories));
      if (selectedFood.protein) setProtein(Number(selectedFood.protein));
      if (selectedFood.fats) setFats(Number(selectedFood.fats));
      if (selectedFood.carbs) setCarbs(Number(selectedFood.carbs));

      return;
    }
    const percentage = Number(inputValue) / selectedFood.quantity;
    setRatio(percentage);
    setCalories(Math.round(percentage * Number(selectedFood.calories)));

    if (selectedFood.protein)
      setProtein(Math.round(percentage * Number(selectedFood.protein)));
    if (selectedFood.fats)
      setFats(Math.round(percentage * Number(selectedFood.fats)));
    if (selectedFood.carbs)
      setCarbs(Math.round(percentage * Number(selectedFood.carbs)));
  };

  const handleChangeMeal = (value: string) => {
    setMeal(value);
  };

  const resetFields = () => {
    setAmount(selectedFood.quantity.toString());
    setCalories(0);
    setProtein(0);
    setCarbs(0);
    setFats(0);
    setMeal("");
  };

  const submitFoodLog = async () => {
    const s_calories =
      calories !== 0 ? calories.toString() : selectedFood.calories;
    const s_quantity = amount !== "" ? Number(amount) : selectedFood.quantity;
    console.log("cak", s_calories);

    const s_protein = protein !== 0 ? protein.toString() : selectedFood.protein;
    const s_carbs = carbs !== 0 ? carbs.toString() : selectedFood.carbs;
    const s_fats = fats !== 0 ? fats.toString() : selectedFood.fats;

    const submissionEntry: FoodInfo = {
      name: selectedFood.name,
      measurement: selectedFood.measurement,
      quantity: s_quantity,
      calories: s_calories,
      referenceId: selectedFood.referenceId,
    };

    if (s_protein) submissionEntry.protein = s_protein;
    if (s_carbs) submissionEntry.carbs = s_carbs;
    if (s_fats) submissionEntry.fats = s_fats;
    if (meal !== "") submissionEntry.meal = meal;

    console.log("submissionEntry", submissionEntry);
    console.log("submission", date);
    await submitFoodtoLog(submissionEntry, date);

    resetFields();
    refetch();
    // userRefetch();
    cb();

    try {
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="submission-form-recent h-full">
      <div className="flex justify-center items-center">
        <div className="font-semibold text-center mr-3 text-md">
          <span>{selectedFood.name}</span>
        </div>
        <button
          //   style={{ width: "20px" }}
          className="mr-1 "
          onClick={resetFields}
        >
          <RestartAlt />
        </button>
        <span className="text-sm">Per</span>

        <input
          className="w-12 mx-1 pl-1 adjust-input drop-shadow-md"
          min={selectedFood.quantity >= 10 ? 1 : 0.1}
          step={selectedFood.measurement === "grams" ? 1 : 0.1}
          value={amount}
          onKeyDown={(e: any) => {
            const key = e.key;
            const allowedKeys = [
              "Backspace",
              "Delete",
              "ArrowLeft",
              "ArrowRight",
              "Tab",
              ".",
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
        <span className="text-sm">{selectedFood.measurement}</span>

        <button
          className="px-2 mt-[1px]  mx-1 back-btn rounded-lg"
          onClick={cb}
        >
          <ArrowBack />
        </button>
        <button
          className="px-2 mr-2 mt-[1px] add-btn rounded-lg font-semibold"
          onClick={submitFoodLog}
        >
          ADD
        </button>
      </div>
      <div className="flex justify-center font-semibold my-2 ">
        <div
          style={{ backgroundColor: "var(--header-colour)" }}
          className="flex w-96 border-b border-gray-400 text-sm drop-shadow-md"
        >
          <div className=" text-center   w-16 mr-1">Calories</div>
          <div className=" text-center  mr-1  w-16">Protein</div>
          <div className=" text-center mr-1 w-16">Carbs</div>
          <div className=" text-center  mr-1 w-16">Fats</div>
          <div className="  text-center   w-24">Meal</div>
        </div>
      </div>

      <div className="flex justify-center text-sm font-semibold ">
        <div className="text-center border-b border-gray-400 mr-1 w-16">
          {amount === "" ||
          amount === selectedFood.quantity.toString() ||
          calories === 0
            ? selectedFood.calories
            : calories}
        </div>
        <div className="border-b  text-center border-gray-400 mr-1 w-16">
          {amount === "" ||
          amount === selectedFood.quantity.toString() ||
          protein === 0
            ? selectedFood.protein
            : protein !== 0
            ? protein
            : "-"}
        </div>
        <div className="border-b text-center border-gray-400 mr-1 w-16">
          {amount === "" ||
          amount === selectedFood.quantity.toString() ||
          carbs === 0
            ? selectedFood.carbs
            : carbs !== 0
            ? carbs
            : "-"}
        </div>
        <div className="border-b text-center border-gray-400 mr-1 w-16">
          {amount === "" ||
          amount === selectedFood.quantity.toString() ||
          fats === 0
            ? selectedFood.fats
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
    </div>
  );
};

export default SelectedRecent;
