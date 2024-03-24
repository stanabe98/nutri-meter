import React from "react";
import { CustomFoods } from "../data/data-types";
import "../custom-components/custom-input.css";

const SavedFoodItem: React.FC<{ item: CustomFoods; [key: string]: any }> = ({
  item,
  ...restProps
}) => {
  return (
    <div {...restProps} className="flex cursor-pointer food-option">
      <div className="pl-1 name-div">{item.foodInfo.name}</div>
      <div className="amount-div">{item.foodInfo.quantity}</div>
      <div className="serving-div">{item.foodInfo.measurement}</div>
      <div className="macro-div">{item.foodInfo.calories}</div>
      <div className="macro-div">{item.foodInfo.protein}</div>
      <div className="macro-div">{item.foodInfo.carbs}</div>
      <div className="macro-div">{item.foodInfo.fats}</div>
    </div>
  );
};

export default SavedFoodItem;
