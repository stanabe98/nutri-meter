import React, { useState, useEffect } from "react";
import { ServingsResult } from "./hooks/useFatSecretApi";
import { ArrowBack } from "@mui/icons-material";
import { Select } from "antd";
import { FoodInfo } from "./data/data-types";
import { submitFoodtoLog } from "./hooks/userGetUserFoods";

const SelectedApiItem: React.FC<{
  foodName: string;
  foodId: string;
  data: ServingsResult[] | [];
  submissionDate: string;
  refetch: any;
  cb: any;
}> = ({ foodName, foodId, data, submissionDate, cb, refetch }) => {
  const [currentData, setCurrentData] = useState<ServingsResult[] | []>(data);
  const [meal, setMeal] = useState("");
  const [selectedCurrentData, setSelectedCurrentData] =
    useState<ServingsResult | null>(data[0]);
  const [adjustselectCurrentData, setadjustSelectCurrentData] =
    useState<ServingsResult | null>(selectedCurrentData);
  const [adjustedServingAmount, setAdjustedServingAmount] = useState(
    selectedCurrentData?.serving_description.split(" ")[0] ?? ""
  );

  const handleChangeMeal = (value: string) => {
    setMeal(value);
  };

  const handleKeydown = (e: any) => {
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
  };

  const handleChange = (value: { value: string }) => {
    const selected = currentData.filter(
      (s) => s.serving_description === value.value
    );
    setSelectedCurrentData(selected[0]);
    setadjustSelectCurrentData(selected[0]);
    setAdjustedServingAmount(selected[0].serving_description.split(" ")[0]);
  };

  const adjustServing = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAdjustedServingAmount(e.target.value);

    const percentage =
      Number(e.target.value) /
      Number(
        eval(selectedCurrentData?.serving_description.split(" ")[0] ?? "")
      );
    const adjusted_p = Math.round(
      percentage * Number(selectedCurrentData?.protein)
    ).toString();
    const adjusted_f = Math.round(
      percentage * Number(selectedCurrentData?.fat)
    ).toString();
    const adjusted_c = Math.round(
      percentage * Number(selectedCurrentData?.carbohydrate)
    ).toString();
    const adjusted_cal = Math.round(
      percentage * Number(selectedCurrentData?.calories)
    ).toString();

    const adjusted_metric = Math.round(
      percentage * Number(selectedCurrentData?.metric_serving_amount)
    ).toString();

    setadjustSelectCurrentData({
      protein: adjusted_p,
      fat: adjusted_f,
      carbohydrate: adjusted_c,
      calories: adjusted_cal,
      serving_id: selectedCurrentData?.serving_id ?? "",
      serving_description: selectedCurrentData?.serving_description ?? "",
      metric_serving_amount: adjusted_metric ?? "",
      metric_serving_unit: selectedCurrentData?.metric_serving_unit ?? "",
      measurement_description:
        selectedCurrentData?.measurement_description ?? "",
    });
  };

  const submitFoodtoEntry = async () => {
    const quantity = Number(eval(adjustedServingAmount));
    const referenceId = foodId;
    const calories = Math.round(Number(adjustselectCurrentData?.calories));
    const fats = Math.round(Number(adjustselectCurrentData?.fat));
    const carbs = Math.round(Number(adjustselectCurrentData?.carbohydrate));
    const protein = Math.round(Number(adjustselectCurrentData?.protein));
    const name = foodName.split(",")[0];
    const measurement = selectedCurrentData?.measurement_description;

    const submissionEntry: FoodInfo = {
      name: name,
      measurement: measurement,
      quantity: quantity,
      calories: calories.toString() ?? "",
      referenceId: referenceId,
      carbs: carbs.toString(),
      protein: protein.toString(),
      fats: fats.toString(),
    };
    if (meal !== "") submissionEntry.meal = meal;

    await submitFoodtoLog(submissionEntry, submissionDate);

    refetch();
    cb();
  };

  useEffect(() => {
    setCurrentData(data);
  }, [data]);

  return (
    <div className="submission-form">
      <div className="flex justify-center pt-2 pb-2 text-md font-semibold">
        <span>{foodName}</span>
      </div>

      <div className="flex justify-center text-sm">
        <div>
          {`Metric servings: ${
            selectedCurrentData?.metric_serving_amount
              ? Math.round(
                  Number(adjustselectCurrentData?.metric_serving_amount)
                )
              : `${adjustedServingAmount} ${
                  selectedCurrentData?.serving_description.split(" ")[1]
                }`
          }    ${selectedCurrentData?.metric_serving_unit ?? ""}`}
        </div>
      </div>
      <div className="flex justify-center font-semibold my-2 text-sm ">
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
      <div className="flex justify-center mt-1 text-sm font-semibold">
        <div className="border-b text-center border-gray-400 mr-1 w-16">{`${Math.round(
          Number(adjustselectCurrentData?.calories)
        )}`}</div>
        <div className="border-b text-center border-gray-400 mr-1 w-16">{`${Math.round(
          Number(adjustselectCurrentData?.protein)
        )}`}</div>
        <div className="border-b text-center border-gray-400 mr-1 w-16">{`${Math.round(
          Number(adjustselectCurrentData?.carbohydrate)
        )}`}</div>
        <div className="border-b text-center border-gray-400 mr-1 w-16">{`${Math.round(
          Number(adjustselectCurrentData?.fat)
        )}`}</div>

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
      <div className="flex justify-center mt-2">
        <Select
          className=" drop-shadow-md"
          labelInValue
          onChange={handleChange}
          defaultValue={{ value: data[0].serving_description }}
          style={{ width: 120 }}
          options={data.map((s) => {
            return { value: s.serving_description };
          })}
        />
        <input
          value={eval(adjustedServingAmount)}
          onChange={adjustServing}
          min={0}
          step={1}
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
          className="border w-14 adjust-input pl-1 ml-2 drop-shadow-md"
        />
        <span>{selectedCurrentData?.serving_description.split(" ")[1]}</span>
      </div>
      <div className="flex justify-center mt-2">
        <button className=" back-btn rounded-md mr-2 px-2" onClick={cb}>
          <ArrowBack />
        </button>
        <button
          className="px-2 mr-2 add-btn rounded-lg font-semibold"
          onClick={submitFoodtoEntry}
        >
          ADD
        </button>
      </div>
    </div>
  );
};

export default SelectedApiItem;
