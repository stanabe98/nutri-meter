import React, { useState, useEffect } from "react";
import { ServingsResult } from "./hooks/useFatSecretApi";
import { Select } from "antd";

const SelectedApiItem: React.FC<{
  foodName: string;
  foodId:string;
  data: ServingsResult[] | [];
  cb: any;
}> = ({ foodName,foodId, data, cb }) => {
  const [currentData, setCurrentData] = useState<ServingsResult[] | []>(data);
  const [selectedCurrentData, setSelectedCurrentData] =
    useState<ServingsResult | null>(data[0]);
  const [adjustselectCurrentData, setadjustSelectCurrentData] =
    useState<ServingsResult | null>(selectedCurrentData);
  const [adjustedServingAmount, setAdjustedServingAmount] = useState(
    selectedCurrentData?.serving_description.split(" ")[0] ?? ""
  );

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
      Number(selectedCurrentData?.serving_description.split(" ")[0]);
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
      measurement_description: selectedCurrentData?.measurement_description ?? "",
    });
  };


  const submitFoodtoEntry=()=>{
    const quantity= Number(adjustedServingAmount)
    const referenceId= foodId;
    const calories= adjustselectCurrentData?.calories
    const fats = adjustselectCurrentData?.fat;
    const carbs = adjustselectCurrentData?.carbohydrate;
    const protein = adjustselectCurrentData?.protein;
    const name= foodName.split(",")[0]
    const measurement = selectedCurrentData?.measurement_description





  }

  useEffect(() => {
    setCurrentData(data);
  }, [data]);

  return (
    <div className="w-[400px]">
      <div className="flex justify-center ">
        <h2>{foodName}</h2>
      </div>
      <button className=" mb-5 p-3 border border-black" onClick={cb}>
        Back
      </button>
      <div>
        <span>Metric servings</span>
        <div>
          {`${
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
      <div className="flex justify-center gap-1">
        <div>{`Calories ${Math.round(
          Number(adjustselectCurrentData?.calories)
        )}`}</div>
        <div>{`Protein ${Math.round(
          Number(adjustselectCurrentData?.protein)
        )}`}</div>
        <div>{`Carbs ${Math.round(
          Number(adjustselectCurrentData?.carbohydrate)
        )}`}</div>
        <div>{`Fats ${Math.round(Number(adjustselectCurrentData?.fat))}`}</div>

        <Select
          labelInValue
          onChange={handleChange}
          defaultValue={{ value: data[0].serving_description }}
          style={{ width: 120 }}
          options={data.map((s) => {
            return { value: s.serving_description };
          })}
        />
        <input
          value={adjustedServingAmount}
          onChange={adjustServing}
          type="number"
          className="border w-16 border-indigo-800"
        />
        <span>{selectedCurrentData?.serving_description.split(" ")[1]}</span>
      </div>
      <button>Add to diary</button>
    </div>
  );
};

export default SelectedApiItem;
