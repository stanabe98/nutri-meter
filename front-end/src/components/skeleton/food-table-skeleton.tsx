import React from "react";
import Skeleton from "@mui/material/Skeleton";
import "../table.css";

const FoodTableSkeleton: React.FC = () => {
  return (
    <div className="ml-8 overflow-y-scroll h-[500px] border border-black">
      <table className="calorie-table">
        <thead className="sticky-row">
          <tr>
            <th>-</th>
            <th>Calories</th>
            <th>Carbs</th>
            <th>Fats</th>
            <th>Protein</th>
            <th>-</th>
          </tr>
          <tr className="mb-2"></tr>
        </thead>
        <tbody className="main-body">
          {[...Array(12)].map(
            (
              _,
              index // Render skeleton rows
            ) => (
              <tr key={index}>
                <td>
                  <Skeleton />
                </td>
                <td>
                  <Skeleton />
                </td>
                <td>
                  <Skeleton />
                </td>
                <td>
                  <Skeleton />
                </td>
                <td>
                  <Skeleton />
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
};

export default FoodTableSkeleton;
