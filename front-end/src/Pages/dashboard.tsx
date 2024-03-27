import React, { useState, useEffect } from "react";
import { useGetAllFoodLogs } from "../components/hooks/useGetallLog";
import dayjs from "dayjs";
import { Select } from "antd";
import { LineChart } from "@mui/x-charts";
import SavedFoodsTable from "../components/dashboard-components/saved-foods-table";
import TextField from "@mui/material/TextField";
import ModifyTargets from "../components/dashboard-components/goals-component";
import { useGetCurrentUserInfo } from "../components/hooks/userGetUserFoods";
import { Skeleton } from "@mui/material";

const Dashboard = () => {
  const [xaxisData, setxaxisData] = useState([new Date("04-12-2023")]);

  const [yaxisData, setYaxisData] = useState([0]);
  const [dates, setDates] = useState<{ value: string; label: string }[]>([]);
  const [selectedDate, setselectedDate] = useState<string>("week");

  const { queryResult, error, refetch, isLoading } = useGetAllFoodLogs();
  const {
    queryResult: currentUserData,
    refetch: refetchData,
    isLoading: loading,
  } = useGetCurrentUserInfo();

  const handleChangeDateRange = (value: string) => {
    setselectedDate(value);
  };

  useEffect(() => {
    if (queryResult) {
      const datekeys = Object.keys(queryResult);
      const dateOptions = datekeys.map((s) => ({ value: s, label: s }));
      setDates(dateOptions);

      const array1 = queryResult[selectedDate].map((obj) => {
        const something = dayjs(obj.date).format("MMM D");
        const [day, month, year] = obj.date.split("-");
        const numericDay = parseInt(day, 10);
        const numericMonth = parseInt(month, 10);
        const numericYear = parseInt(year, 10);
        const date = new Date(numericYear, numericMonth - 1, numericDay);

        return date;
      });
      const array2 = queryResult[selectedDate].map(
        (obj) => obj.totalMacros?.totalCalories ?? 0
      );

      setxaxisData(array1);
      setYaxisData(array2);
    }
  }, [queryResult, selectedDate]);

  return (
    <>
      <div className="w-full h-2/4 flex mb-10">
        <div className="w-3/4 h-full">
          <span>Chart for: </span>
          <Select
            value={selectedDate}
            className="w-24 mt-2 h-6 drop-shadow-md ml-2 font-semibold"
            options={dates}
            onChange={handleChangeDateRange}
          />

          {!isLoading ? (
            <div className="w-full chart-bg h-full pl-2">
              <LineChart
                xAxis={[
                  {
                    label: "Date",
                    data: xaxisData,
                    tickMinStep:
                      selectedDate == "week"
                        ? 3600 * 1000 * 24
                        : selectedDate == "month"
                        ? 3600 * 1000 * 24 * 7
                        : 3600 * 1000 * 24 * 30,
                    scaleType: "time",
                    valueFormatter: (date) => dayjs(date).format("MMM D"),
                  },
                ]}
                series={[{ label: "Calories(kcal)", data: yaxisData }]}
              />
            </div>
          ) : (
            <div className="w-full h-full">
              <Skeleton style={{ height: "100%" }} className="w-full h-full" />
            </div>
          )}
        </div>
        <div className="pt-10 w-1/4 pr-5">
          <ModifyTargets
            queryResult={currentUserData}
            refetch={refetchData}
            isLoading={loading}
          />
        </div>
      </div>

      <div className=" h-1/3">
        <SavedFoodsTable
          queryResult={currentUserData}
          refetch={refetchData}
          isLoading={loading}
        />
      </div>
    </>
  );
};

export default Dashboard;
