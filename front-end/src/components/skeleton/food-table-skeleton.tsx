import React from "react";
import Skeleton from "react-loading-skeleton"; // Import Skeleton component
import "../table.css";

const FoodTableSkeleton: React.FC = () => {
  return (
    <div className="ml-8 w-2/4 overflow-y-scroll h-[500px] border border-black">
      <table className="calorie-table">
        <thead className="sticky-row">
          <tr>
            <th>-</th>
            <th>Calories</th>
            <th>Carbs</th>
            <th>Fats</th>
            <th>Protein</th>
            
          </tr>
          <tr className="mb-2"></tr>
        </thead>
        <tbody className="main-body">
          {[...Array(5)].map(
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
