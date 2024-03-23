import React, { useEffect, useState, useMemo, useCallback } from "react";
import "./table.css";
import { FoodInfo, FoodLogEntry } from "./data/data-types";
import LoadingSkeleton from "./skeleton/food-table-skeleton";
import {
  EditOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { EditableCell } from "./small-components/editable-cell";
import UserFoodStore from "./stores/foodLogStore";
import {
  deleteUserFoodLog,
  modifyUserFoodLog,
  modifyFoodLogSavedFood,
} from "./hooks/useGetUserInfo";
import {
  IconMeat,
  IconEggFried,
  IconCookie,
  IconToolsKitchen2,
  IconToolsKitchen3,
} from "@tabler/icons-react";
import { OptionalCaloriesFoodInfo } from "./hooks/useGetUserInfo";

interface FoodInfoWithId extends FoodInfo {
  _id: string;
}

interface GroupedData {
  [key: string]: FoodInfoWithId[];
}

interface Macro {
  calories: number;
  fats: number;
  protein: number;
  carbs: number;
}

interface RenderIcon {
  [key: string]: JSX.Element;
}

const FoodLogView: React.FC<{
  tableData: FoodLogEntry[] | null;
  loading: boolean;
  dateString: string;
  refetchData: any;
}> = ({ tableData, loading, dateString, refetchData }) => {
  const [selectedEditId, setSelectedEditId] = useState("");
  const [editSubmitted, setEditSubmitted] = useState(false);
  const [defaultEdited, setDefaultEditted] = useState<FoodInfoWithId | null>(
    null
  );

  const [editedcalories, setEditedCalories] = useState(0);
  const [editedamount, setEditedAmount] = useState("");
  const [editedprotein, setEditedProtein] = useState(0);
  const [editedcarbs, setEditedCarbs] = useState(0);
  const [editedfats, setEditedFats] = useState(0);
  const [editedmeal, setEditedMeal] = useState("");

  const groupedData: GroupedData | null = tableData
    ? tableData.reduce((acc, item) => {
        const meal = item.foodInfo.meal || "Snacks";
        if (!acc[meal]) {
          acc[meal] = [];
        }
        const _id = item._id;
        const foodWithId = { ...item.foodInfo, _id };
        acc[meal].push(foodWithId);
        return acc;
      }, {} as GroupedData)
    : null;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    setEditedAmount(inputValue);
    if (defaultEdited) {
      if (inputValue === "") {
        setEditedCalories(Number(defaultEdited.calories));
        if (defaultEdited.protein)
          setEditedProtein(Number(defaultEdited.protein));
        if (defaultEdited.fats) setEditedFats(Number(defaultEdited.fats));
        if (defaultEdited.carbs) setEditedCarbs(Number(defaultEdited.carbs));

        return;
      }
      const percentage =
        Number(inputValue) / (defaultEdited.quantity ?? Number(inputValue));
      setEditedCalories(
        Math.round(percentage * Number(defaultEdited.calories))
      );

      if (defaultEdited.protein)
        setEditedProtein(
          Math.round(percentage * Number(defaultEdited.protein))
        );
      if (defaultEdited.fats)
        setEditedFats(Math.round(percentage * Number(defaultEdited.fats)));
      if (defaultEdited.carbs)
        setEditedCarbs(Math.round(percentage * Number(defaultEdited.carbs)));
    }
  };

  const submitEditedSavedFood = async () => {
    if (defaultEdited?.quantity) {
      if (
        defaultEdited.quantity === Number(editedamount) ||
        editedamount === ""
      ) {
        setDefaultEditted(null);
        setSelectedEditId("");
        return;
      }

      const submissionObject: FoodInfo = {
        calories: editedcalories.toString(),
      };

      if (editedfats !== 0) submissionObject.fats = editedfats.toString();
      if (editedprotein !== 0)
        submissionObject.protein = editedprotein.toString();
      if (editedcarbs !== 0) submissionObject.carbs = editedcarbs.toString();
      submissionObject.quantity = Number(editedamount);

      await modifyFoodLogSavedFood(
        submissionObject,
        selectedEditId,
        dateString,
        refetchData,
        () => setSelectedEditId("")
      );
    }
  };

  const renderIcon: RenderIcon = {
    Breakfast: <IconEggFried size={16} />,
    Lunch: <IconMeat size={16} />,
    Dinner: <IconToolsKitchen3 size={16} />,
    Snacks: <IconCookie size={16} />,
  };

  const handleClickOutside = (e: any) => {
    const targetElement = e.target as HTMLElement;
    const closestTableRow = targetElement.closest("tr");
    const acceptOption = "ant-select-item-option-content";

    if (
      targetElement.className == acceptOption ||
      closestTableRow?.dataset.key === selectedEditId
    ) {
      return;
    }
    if (!closestTableRow) {
      return;
    }
    setSelectedEditId("");
    setDefaultEditted(null);
  };

  const calculateTotals = (foods: FoodInfoWithId[] | undefined) => {
    if (!foods) return { calories: 0, fats: 0, protein: 0, carbs: 0 };
    return foods.reduce(
      (totals, food) => {
        totals.calories += Number(eval(food.calories));
        totals.fats = (totals.fats ?? 0) + Number(eval(food.fats ?? "0"));
        totals.protein =
          (totals.protein ?? 0) + Number(eval(food.protein ?? "0"));
        totals.carbs = (totals.carbs ?? 0) + Number(eval(food.carbs ?? "0"));
        return totals;
      },
      { calories: 0, fats: 0, protein: 0, carbs: 0 }
    );
  };

  const timePeriods = ["Breakfast", "Lunch", "Dinner", "Snacks"];

  useEffect(() => {
    if (selectedEditId !== "") {
      document.addEventListener("click", handleClickOutside);
    }
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [tableData, selectedEditId]);

  return (
    <>
      {!loading ? (
        <div className="mx-8 overflow-y-scroll calorie-table-div px-1 border  rounded-md border-black">
          <table className="w-full calorie-table  bg-slate-200 ">
            <thead className="  ">
              <tr className="bg-lime-400">
                <th className="sticky-table-header border-r border-black">-</th>
                <th className=" sticky-table-header text-sm">Calories</th>
                <th className="sticky-table-header text-sm">Carbs</th>
                <th className="sticky-table-header text-sm">Fats</th>
                <th className=" sticky-table-header text-sm ">Protein</th>
                <th className=" sticky-table-header">-</th>
              </tr>
            </thead>
            <tbody className="main-body p-0">
              {timePeriods.map((timePeriod) => (
                <React.Fragment key={timePeriod}>
                  <tr className="timeperiod">
                    <th
                      className={`text-md p-0 ${timePeriod}-header`}
                      colSpan={6}
                    >
                      <div className="flex justify-center p-1 -mt-[1px]  border-y border-black  items-center">
                        {timePeriod}
                        {renderIcon[timePeriod]}
                      </div>
                    </th>
                  </tr>

                  {groupedData
                    ? groupedData[timePeriod]?.map((foodItem, index) => (
                        <tr
                          className="h-11  "
                          key={foodItem._id}
                          data-key={foodItem._id}
                        >
                          <td
                            className={`food-names border-r border-black ${
                              index === groupedData[timePeriod].length - 1
                                ? "border-b"
                                : ""
                            }`}
                          >
                            <div className="text-sm overflow-hidden whitespace-nowrap pl-2 overflow-ellipsis">
                              {foodItem.name ? foodItem.name : "-"}
                              {foodItem.referenceId &&
                              selectedEditId === foodItem._id ? (
                                <>
                                  <input
                                    className="w-14"
                                    type="number"
                                    value={editedamount}
                                    onChange={handleChange}
                                  />
                                  <span>{foodItem.measurement}</span>
                                </>
                              ) : foodItem.referenceId &&
                                selectedEditId !== foodItem._id ? (
                                <>
                                  <span>{` ${foodItem.quantity} ${foodItem.measurement}`}</span>
                                </>
                              ) : null}
                            </div>
                          </td>
                          <td
                            className={`${
                              index === groupedData[timePeriod].length - 1
                                ? "border-b border-black"
                                : ""
                            }`}
                          >
                            {foodItem.referenceId ? (
                              <div className="text-center rounded-md text-sm nutrition-detail border-gray-300 w-full">
                                {foodItem._id === selectedEditId
                                  ? editedcalories
                                  : foodItem.calories}
                              </div>
                            ) : (
                              <>
                                <EditableCell
                                  selectedId={selectedEditId}
                                  cellId={foodItem._id}
                                  value={foodItem.calories}
                                  setEditedObservable={
                                    UserFoodStore.setEditedCalories
                                  }
                                />
                              </>
                            )}
                          </td>
                          <td
                            className={`${
                              index === groupedData[timePeriod].length - 1
                                ? "border-b border-black"
                                : ""
                            }`}
                          >
                            {foodItem.referenceId ? (
                              <div className="text-center text-sm rounded-md nutrition-detail">
                                {foodItem._id === selectedEditId
                                  ? editedcarbs
                                  : foodItem.carbs ?? 0}
                              </div>
                            ) : (
                              <>
                                <EditableCell
                                  selectedId={selectedEditId}
                                  cellId={foodItem._id}
                                  value={foodItem.carbs ?? "0"}
                                  setEditedObservable={
                                    UserFoodStore.setEditedCarbs
                                  }
                                />
                              </>
                            )}
                          </td>

                          <td
                            className={`${
                              index === groupedData[timePeriod].length - 1
                                ? "border-b border-black"
                                : ""
                            }`}
                          >
                            {foodItem.referenceId ? (
                              <div className="text-center text-sm rounded-md nutrition-detail">
                                {foodItem._id === selectedEditId
                                  ? editedfats
                                  : foodItem.fats ?? 0}
                              </div>
                            ) : (
                              <>
                                <EditableCell
                                  selectedId={selectedEditId}
                                  cellId={foodItem._id}
                                  value={foodItem.fats ?? "0"}
                                  setEditedObservable={
                                    UserFoodStore.setEditedFats
                                  }
                                />
                              </>
                            )}
                          </td>
                          <td
                            className={`${
                              index === groupedData[timePeriod].length - 1
                                ? "border-b border-black"
                                : ""
                            }`}
                          >
                            {foodItem.referenceId ? (
                              <div className="text-center text-sm rounded-md nutrition-detail ">
                                {foodItem._id === selectedEditId
                                  ? editedprotein
                                  : foodItem.protein ?? 0}
                              </div>
                            ) : (
                              <>
                                <EditableCell
                                  selectedId={selectedEditId}
                                  cellId={foodItem._id}
                                  value={foodItem.protein ?? "0"}
                                  setEditedObservable={
                                    UserFoodStore.setEditedProtein
                                  }
                                />
                              </>
                            )}
                          </td>
                          {selectedEditId === foodItem._id ? (
                            <>
                              <td
                                className={`${
                                  index === groupedData[timePeriod].length - 1
                                    ? "border-b border-black"
                                    : ""
                                }`}
                              >
                                <div className="flex w-full pt-[1px] justify-between px-1">
                                  {foodItem.referenceId ? (
                                    <>
                                      <CheckCircleOutlined
                                        onClick={submitEditedSavedFood}
                                      />
                                    </>
                                  ) : (
                                    <>
                                      <CheckCircleOutlined
                                        onClick={() => {
                                          modifyUserFoodLog(
                                            foodItem._id,
                                            dateString,
                                            refetchData
                                          );
                                          setEditSubmitted(!editSubmitted);
                                          setSelectedEditId("");
                                          setDefaultEditted(null);
                                        }}
                                      />
                                    </>
                                  )}

                                  <DeleteOutlined
                                    className=""
                                    onClick={() => {
                                      deleteUserFoodLog(
                                        dateString,
                                        foodItem._id,
                                        refetchData
                                      );
                                      setDefaultEditted(null);
                                      setSelectedEditId("");
                                    }}
                                  />
                                </div>
                                <div className=" flex w-full py-[1px] justify-center px-1">
                                  <CloseCircleOutlined
                                    onClick={() => {
                                      setDefaultEditted(null);
                                      setSelectedEditId("");
                                    }}
                                  />
                                </div>
                              </td>
                            </>
                          ) : (
                            <td
                              className={`${
                                index === groupedData[timePeriod].length - 1
                                  ? "border-b border-black"
                                  : ""
                              }`}
                            >
                              <EditOutlined
                                onClick={() => {
                                  if (foodItem.referenceId) {
                                    setDefaultEditted(foodItem);
                                    setEditedCalories(
                                      Number(foodItem.calories)
                                    );
                                    setEditedAmount(
                                      foodItem.quantity?.toString() ?? ""
                                    );
                                    if (foodItem.carbs)
                                      setEditedCarbs(Number(foodItem.carbs));
                                    if (foodItem.fats)
                                      setEditedFats(Number(foodItem.fats));
                                    if (foodItem.protein)
                                      setEditedProtein(
                                        Number(foodItem.protein)
                                      );
                                  }
                                  setSelectedEditId(foodItem._id);
                                }}
                              />
                            </td>
                          )}
                        </tr>
                      ))
                    : null}
                  <tr className="">
                    <td
                      className="text-gray-500 
                   p-0
                    text-xs text-center"
                    >
                      <div className={` ${timePeriod}-div border-t   `}>
                        sub-totals
                      </div>
                    </td>
                    <td className="text-center text-gray-500 text-xs ">
                      <div className={` ${timePeriod}-div border-t    `}>
                        {groupedData
                          ? calculateTotals(groupedData[timePeriod]).calories
                          : 0}
                      </div>
                    </td>
                    <td className="text-center text-gray-500 text-xs">
                      {groupedData
                        ? calculateTotals(groupedData[timePeriod]).carbs
                        : 0}
                    </td>
                    <td className="text-center text-gray-500 text-xs ">
                      {groupedData
                        ? calculateTotals(groupedData[timePeriod]).fats
                        : 0}
                    </td>
                    <td className="text-center text-gray-500 text-xs ">
                      {groupedData
                        ? calculateTotals(groupedData[timePeriod]).protein
                        : 0}
                    </td>
                    <td className="text-center text-gray-500 text-xs "></td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <LoadingSkeleton />
      )}
    </>
  );
};

export default FoodLogView;
