import React from "react";
import "./table.css";

interface mockInterface {
  foodId: string;
  food: string;
  quantity: string;
  measurement: string;
  calories: number;
  fat: number;
  protein: number;
  carbs: number;
  time?: string;
}

const mockData: mockInterface[] = [
  {
    foodId: "123ce",
    food: "rice",
    quantity: "100",
    measurement: "grams",
    calories: 130,
    fat: 2,
    protein: 4,
    carbs: 25,
    time: "breakfast",
  },
  {
    foodId: "124ce",
    food: "egg",
    quantity: "2",
    measurement: "unit",
    calories: 140,
    fat: 8,
    protein: 12,
    carbs: 1,
    time: "lunch",
  },
  {
    foodId: "124c3re",
    food: "egg",
    quantity: "2",
    measurement: "unit",
    calories: 140,
    fat: 8,
    protein: 12,
    carbs: 1,
  },
  {
    foodId: "124c3r7e",
    food: "egg",
    quantity: "2",
    measurement: "unit",
    calories: 140,
    fat: 8,
    protein: 12,
    carbs: 1,
  },
];

interface GroupedData {
  [key: string]: mockInterface[];
}

const FoodLogView = () => {
  const groupedData: GroupedData = mockData.reduce((acc, item) => {
    const time = item.time || "snacks"; // Use 'Snacks' as the default time if not specified
    if (!acc[time]) {
      acc[time] = [];
    }
    acc[time].push(item);
    return acc;
  }, {} as GroupedData);

  const timePeriods = ["breakfast", "lunch", "dinner", "snacks"];

  return (
    // <div>
    //   <table className="calorie-table">
    //     <thead>
    //       <tr>
    //         <th>-</th>

    //         <th>Calories</th>
    //         <th>Carbs</th>
    //         <th>Fats</th>
    //         <th>Protein</th>
    //       </tr>
    //       <div className="mb-2"></div>
    //     </thead>

    //     <tbody>
    //       <th>BreakFast</th>

    //       <tr>
    //         <td>Food Description</td>
    //         <td>2</td>
    //         <td>2</td>
    //         <td>2</td>
    //         <td>2</td>
    //       </tr>
    //       <tr>
    //         <td>Food Description</td>
    //         <td>2</td>
    //         <td>2</td>
    //         <td>2</td>
    //         <td>2</td>
    //       </tr>
    //       <th>Lunch</th>
    //       <tr>
    //         <td>Food Description</td>
    //         <td>2</td>
    //         <td>2</td>
    //         <td>2</td>
    //         <td>2</td>
    //       </tr>
    //       <tr>
    //         <td>Food Description</td>
    //         <td>2</td>
    //         <td>2</td>
    //         <td>2</td>
    //         <td>2</td>
    //       </tr>
    //     </tbody>
    //   </table>
    // </div>
    <div>
      <table className="calorie-table">
        <thead>
          <tr>
            <th>-</th>
            <th>Calories</th>
            <th>Carbs</th>
            <th>Fats</th>
            <th>Protein</th>
          </tr>
          <tr className="mb-2"></tr>
        </thead>
        <tbody>
          {timePeriods.map((timePeriod) => (
            <React.Fragment key={timePeriod}>
              <tr>
                <th colSpan={1}>{timePeriod}</th>
              </tr>
              {groupedData[timePeriod]?.map((foodItem, index) => (
                <tr key={index}>
                  <td>{foodItem.food}</td>
                  <td>{foodItem.calories}</td>
                  <td>{foodItem.carbs}</td>
                  <td>{foodItem.fat}</td>
                  <td>{foodItem.protein}</td>
                </tr>
              ))}
              {/* Render an empty row if no food items are logged for this time period */}
              {!groupedData[timePeriod]?.length && <tr></tr>}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FoodLogView;
