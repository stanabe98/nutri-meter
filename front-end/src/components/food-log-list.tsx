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
import { deleteUserFoodLog, modifyUserFoodLog } from "./hooks/useGetUserInfo";

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

const FoodLogView: React.FC<{
  tableData: FoodLogEntry[] | null;
  loading: boolean;
  dateString: string;
  refetchData: any;
}> = ({ tableData, loading, dateString, refetchData }) => {
  const [selectedEditId, setSelectedEditId] = useState("");
  // const [groupedData, setGroupedData] = useState<GroupedData | null>(null);
  const [editSubmitted, setEditSubmitted] = useState(false);

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
  };

  const modifiedTableData = () => {
    if (tableData) {
      const currentData = tableData.map((obj) => ({
        ...obj,
        foodInfo: {
          ...obj.foodInfo,
          calories: Number(eval(obj.foodInfo.calories)),
          protein: Number(eval(obj.foodInfo.protein ?? "0")),
          carbs: Number(eval(obj.foodInfo.carbs ?? "0")),
          fats: Number(eval(obj.foodInfo.fats ?? "0")),
        },
      }));
      return currentData;
    }
    return null;
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
        <div className="mx-8 w-2/5 overflow-y-scroll h-5/6 border border-black">
          <table className="w-full calorie-table">
            <thead className="sticky-row">
              <tr>
                <th>-</th>
                <th>Calories</th>
                <th>Carbs</th>
                <th>Fats</th>
                <th>Protein</th>
                {selectedEditId !== "" && <th>-</th>}
              </tr>
              <tr className="mb-2"></tr>
            </thead>
            <tbody className="main-body">
              {timePeriods.map((timePeriod) => (
                <React.Fragment key={timePeriod}>
                  <tr>
                    <th colSpan={1}>{timePeriod}</th>
                  </tr>

                  {groupedData
                    ? groupedData[timePeriod]?.map((foodItem, index) => (
                        <tr key={foodItem._id} data-key={foodItem._id}>
                          <td>
                            <div>
                              {foodItem.name ? foodItem.name : "-"}
                              {selectedEditId == foodItem._id ? (
                                <>
                                  <div className="flex">
                                    <CloseCircleOutlined
                                      onClick={() => setSelectedEditId("")}
                                    />
                                    <CheckCircleOutlined
                                      onClick={() => {
                                        modifyUserFoodLog(
                                          foodItem._id,
                                          dateString,
                                          refetchData
                                        );
                                        setEditSubmitted(!editSubmitted);
                                        setSelectedEditId("");
                                        refetchData();
                                      }}
                                    />
                                  </div>
                                  {/* <DeleteOutlined
                                    onClick={() => {
                                      deleteUserFoodLog(
                                        dateString,
                                        foodItem._id,
                                        refetchData
                                      );
                                      setSelectedEditId("");
                                    }}
                                  /> */}
                                </>
                              ) : (
                                <EditOutlined
                                  onClick={() =>
                                    setSelectedEditId(foodItem._id)
                                  }
                                />
                              )}
                            </div>
                          </td>
                          <td
                            className={`${
                              selectedEditId === "" ? "w-15/100" : "w-1/10"
                            }`}
                          >
                            <EditableCell
                              selectedId={selectedEditId}
                              cellId={foodItem._id}
                              value={foodItem.calories}
                              setEditedObservable={
                                UserFoodStore.setEditedCalories
                              }
                            />
                          </td>
                          <td
                            className={`${
                              selectedEditId === "" ? "w-15/100" : "w-1/10"
                            }`}
                          >
                            <EditableCell
                              selectedId={selectedEditId}
                              cellId={foodItem._id}
                              value={foodItem.carbs ?? "0"}
                              setEditedObservable={UserFoodStore.setEditedCarbs}
                            />
                          </td>

                          <td
                            className={`${
                              selectedEditId === "" ? "w-15/100" : "w-1/10"
                            }`}
                          >
                            <EditableCell
                              selectedId={selectedEditId}
                              cellId={foodItem._id}
                              value={foodItem.fats ?? "0"}
                              setEditedObservable={UserFoodStore.setEditedFats}
                            />
                          </td>
                          <td
                            className={`${
                              selectedEditId === "" ? "w-15/100" : "w-1/10"
                            }`}
                          >
                            <EditableCell
                              selectedId={selectedEditId}
                              cellId={foodItem._id}
                              value={foodItem.protein ?? "0"}
                              setEditedObservable={
                                UserFoodStore.setEditedProtein
                              }
                            />
                          </td>
                          {selectedEditId === foodItem._id && (
                            <td style={{ width: "4px" }}>
                              <DeleteOutlined
                                onClick={() => {
                                  deleteUserFoodLog(
                                    dateString,
                                    foodItem._id,
                                    refetchData
                                  );
                                  setSelectedEditId("");
                                }}
                              />
                            </td>
                          )}
                        </tr>
                      ))
                    : null}

                  {/* Row for totals */}
                  <tr>
                    <td className="text-gray-500 text-sm">sub-totals</td>
                    <td>
                      {groupedData
                        ? calculateTotals(groupedData[timePeriod]).calories
                        : 0}

                      {/* {TimePeriodStateObj[timePeriod].calories} */}
                    </td>
                    <td>
                      {groupedData
                        ? calculateTotals(groupedData[timePeriod]).carbs
                        : 0}
                      {/* {TimePeriodStateObj[timePeriod].carbs} */}
                    </td>
                    <td>
                      {groupedData
                        ? calculateTotals(groupedData[timePeriod]).fats
                        : 0}
                      {/* {TimePeriodStateObj[timePeriod].fats} */}
                    </td>
                    <td>
                      {groupedData
                        ? calculateTotals(groupedData[timePeriod]).protein
                        : "-"}
                      {/* {TimePeriodStateObj[timePeriod].protein} */}
                    </td>
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
