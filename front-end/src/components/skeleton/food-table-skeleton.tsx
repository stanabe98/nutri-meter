import React from "react";
import Skeleton from "@mui/material/Skeleton";
import "../table.css";
import {
  IconMeat,
  IconEggFried,
  IconCookie,
  IconToolsKitchen3,
} from "@tabler/icons-react";

interface RenderIcon {
  [key: string]: JSX.Element;
}

const FoodTableSkeleton: React.FC = () => {
  const renderIcon: RenderIcon = {
    Breakfast: <IconEggFried size={16} />,
    Lunch: <IconMeat size={16} />,
    Dinner: <IconToolsKitchen3 size={16} />,
    Snacks: <IconCookie size={16} />,
  };

  const timePeriods = ["Breakfast", "Lunch", "Dinner", "Snacks"];

  return (
    <div className="ml-2 overflow-y-scroll calorie-table-div pl-1  rounded-md mb-2 drop-shadow-md ">
      <table className="w-full calorie-table  ">
        <thead className="  ">
          <tr className="drop-shadow-lg">
            <th className="sticky-table-header border-r food-name-header border-gray-400">
              -
            </th>
            <th className=" sticky-table-header text-sm macro-header">
              Calories
            </th>
            <th className="sticky-table-header text-sm macro-header">Carbs</th>
            <th className="sticky-table-header text-sm macro-header">Fats</th>
            <th className=" sticky-table-header text-sm macro-header ">
              Protein
            </th>
            <th className=" sticky-table-header edit-header">-</th>
          </tr>
        </thead>
        <tbody className="main-body p-0">
          <tr className="timeperiod">
            <th className={`text-md p-0 `} colSpan={6}>
              <div className="flex justify-center p-1 -mt-[1px]   border-y border-gray-400   items-center">
                Breakfast
                <IconEggFried />
              </div>
            </th>
          </tr>
          {[...Array(1)].map(() => (
            <>
              <tr className="h-11">
                {[...Array(6)].map(() => (
                  <>
                    <td>
                      <Skeleton />
                    </td>
                  </>
                ))}
              </tr>
            </>
          ))}
          <tr className={` drop-shadow-md `}>
            <td
              className={`text-gray-500 border-y border-gray-400 p-0 drop-shadow-md
                    text-xs text-center`}
            >
              <div>sub-totals</div>
            </td>
            {[...Array(4)].map(() => (
              <>
                <td
                  className={`text-gray-500 border-y border-gray-400 text-xs text-center`}
                >
                  <div>0</div>
                </td>
              </>
            ))}
            <td
              className={`text-gray-500 border-y border-gray-400 text-xs text-center`}
            ></td>
          </tr>

          <tr className="timeperiod">
            <th className={`text-md p-0 `} colSpan={6}>
              <div className="flex justify-center p-1 -mt-[1px]   border-y border-gray-400   items-center">
                Lunch
                <IconMeat />
              </div>
            </th>
          </tr>
          {[...Array(1)].map(() => (
            <>
              <tr className="h-11">
                {[...Array(6)].map(() => (
                  <>
                    <td>
                      <Skeleton />
                    </td>
                  </>
                ))}
              </tr>
            </>
          ))}
          <tr className={` drop-shadow-md `}>
            <td
              className={`text-gray-500 border-y border-gray-400 p-0 drop-shadow-md
                    text-xs text-center`}
            >
              <div>sub-totals</div>
            </td>
            {[...Array(4)].map(() => (
              <>
                <td
                  className={`text-gray-500 border-y border-gray-400 text-xs text-center`}
                >
                  <div>0</div>
                </td>
              </>
            ))}
            <td
              className={`text-gray-500 border-y border-gray-400 text-xs text-center`}
            ></td>
          </tr>
          <tr className="timeperiod">
            <th className={`text-md p-0 `} colSpan={6}>
              <div className="flex justify-center p-1 -mt-[1px]   border-y border-gray-400   items-center">
                Dinner
                <IconToolsKitchen3 />
              </div>
            </th>
          </tr>
          {[...Array(1)].map(() => (
            <>
              <tr className="h-11">
                {[...Array(6)].map(() => (
                  <>
                    <td>
                      <Skeleton />
                    </td>
                  </>
                ))}
              </tr>
            </>
          ))}
          <tr className={` drop-shadow-md `}>
            <td
              className={`text-gray-500 border-y border-gray-400 p-0 drop-shadow-md
                    text-xs text-center`}
            >
              <div>sub-totals</div>
            </td>
            {[...Array(4)].map(() => (
              <>
                <td
                  className={`text-gray-500 border-y border-gray-400 text-xs text-center`}
                >
                  <div>0</div>
                </td>
              </>
            ))}
            <td
              className={`text-gray-500 border-y border-gray-400 text-xs text-center`}
            ></td>
          </tr>
          <tr className="timeperiod">
            <th className={`text-md p-0 `} colSpan={6}>
              <div className="flex justify-center p-1 -mt-[1px]   border-y border-gray-400   items-center">
                Snacks
                <IconCookie />
              </div>
            </th>
          </tr>
          {[...Array(1)].map(() => (
            <>
              <tr className="h-11">
                {[...Array(6)].map(() => (
                  <>
                    <td>
                      <Skeleton />
                    </td>
                  </>
                ))}
              </tr>
            </>
          ))}
          <tr className={` drop-shadow-md `}>
            <td
              className={`text-gray-500 border-y border-gray-400 p-0 drop-shadow-md
                    text-xs text-center`}
            >
              <div>sub-totals</div>
            </td>
            {[...Array(4)].map(() => (
              <>
                <td
                  className={`text-gray-500 border-y border-gray-400 text-xs text-center`}
                >
                  <div>0</div>
                </td>
              </>
            ))}
            <td
              className={`text-gray-500 border-y border-gray-400 text-xs text-center`}
            ></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default FoodTableSkeleton;
