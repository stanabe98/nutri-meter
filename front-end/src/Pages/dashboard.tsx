import React, { useState, useEffect } from "react";
import { useGetAllFoodLogs } from "../components/hooks/useGetallLog";
import dayjs from "dayjs";
import { LineChart } from "@mui/x-charts";
import SavedFoodsTable from "../components/dashboard-components/saved-foods-table";
import TextField from "@mui/material/TextField";
import ModifyTargets from "../components/dashboard-components/goals-component";
import { useGetCurrentUserInfo } from "../components/hooks/userGetUserFoods";

const Dashboard = () => {
  const [xaxisData, setxaxisData] = useState([new Date("04-12-2023")]);

  const [yaxisData, setYaxisData] = useState([0]);

  const { queryResult, error, refetch, isLoading } = useGetAllFoodLogs();
  const {
    queryResult: currentUserData,
    refetch: refetchData,
    isLoading: loading,
  } = useGetCurrentUserInfo();

  useEffect(() => {
    if (queryResult) {
      const array1 = queryResult.map((obj) => {
        const something = dayjs(obj.date).format("MMM D");
        const [day, month, year] = obj.date.split("-");
        const numericDay = parseInt(day, 10);
        const numericMonth = parseInt(month, 10);
        const numericYear = parseInt(year, 10);
        const date = new Date(numericYear, numericMonth - 1, numericDay);

        return date;
      });
      const array2 = queryResult.map(
        (obj) => obj.totalMacros?.totalCalories ?? 0
      );

      setxaxisData(array1);
      setYaxisData(array2);
    }
  }, [queryResult]);

  return (
    <>
      <div className="w-3/4">
        <TextField
          id="outlined-basic"
          value="3"
          label="Outlined"
          variant="outlined"
        />

        {!isLoading ? (
          <LineChart
            className="px-8"
            xAxis={[
              {
                label: "Date",
                data: xaxisData,
                tickInterval: xaxisData,
                scaleType: "time",
                valueFormatter: (date) => dayjs(date).format("MMM D"),
              },
            ]}
            yAxis={[{ label: "Calories" }]}
            series={[{ label: "Calories", data: yaxisData }]}
            height={400}
          />
        ) : (
          <></>
        )}
      </div>
      <div className="flex">
        <SavedFoodsTable
          queryResult={currentUserData}
          refetch={refetchData}
          isLoading={loading}
        />
        <ModifyTargets
          queryResult={currentUserData}
          refetch={refetchData}
          isLoading={loading}
        />
      </div>
    </>
  );
};

export default Dashboard;
