import React from "react";
import { CustomFoods } from "../data/data-types";
import "../custom-components/custom-input.css"

const SavedFoodItem: React.FC<{ item: CustomFoods; [key: string]: any }> = ({
  item,
  ...restProps
}) => {
  return (
    <div {...restProps} className="flex cursor-pointer food-option">
      <div className="w-32">{item.foodInfo.name}</div>
      <div className="w-16">{item.foodInfo.quantity}</div>
      <div className="w-16">{item.foodInfo.measurement}</div>
      <div className="w-16">{item.foodInfo.calories}</div>
      <div className="w-16">{item.foodInfo.protein}</div>
      <div className="w-16">{item.foodInfo.carbs}</div>
      <div className="w-16">{item.foodInfo.fats}</div>
    </div>
  );
};

export default SavedFoodItem;
