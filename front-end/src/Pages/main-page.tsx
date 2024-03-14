import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  urlDate,
  postConfig,
  getConfig,
  formatDate,
  formatCurrentDate,
} from "../components/helpers";
import { isValidDate, isCurrentDay } from "../components/helpers";
import { useAuthContext } from "../context/AuthContext";
import axios from "axios";
import DateSelector from "../components/small-components/date-picker";
import FoodLogView from "../components/food-log-list";
import { UserFoodLog } from "../components/data/data-types";
import {
  getUserFoodLog,
  useGetUserFoodLog,
} from "../components/hooks/useGetUserInfo";
import MacroSubmissionForm from "../components/small-components/macro-submission";
import MacroTotals from "../components/small-components/macro-totals";
import MacroChart from "../components/small-components/macro-chart";
import NutritionTarget from "../components/small-components/macro-goals";
import PersonIcon from "@mui/icons-material/Person";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useGetCurrentUserInfo } from "../components/hooks/userGetUserFoods";
import SearchSavedFood from "../components/add-saved";

const MainPage = () => {
  const { date } = useParams<{ date: string }>();
  const { user } = useAuthContext();
  const [apiData, setApiData] = useState<UserFoodLog | []>([]);
  const urlDate =
    date && isValidDate(date) && !isCurrentDay(date)
      ? date
      : formatCurrentDate();
  const navigate = useNavigate();

  const { queryResult, error, isLoading, refetch } = useGetUserFoodLog({
    dataQueryKey: ["foodLog", urlDate],
    dateString: urlDate,
  });
  const {
    queryResult: userInfoResult,
    isLoading: userInfoLoading,
    error: userInfoError,
    refetch: userInfoRefetch,
  } = useGetCurrentUserInfo();

  useEffect(() => {
    if (date) {
      if (!isValidDate(date) || isCurrentDay(date)) {
        navigate("/user", { replace: true });
        return;
      }
      // fetchData(date);
    } else {
      // fetchData(formatCurrentDate());
    }
  }, [user]);

  useEffect(() => {
    console.log("new queryresult", queryResult?.foodLog);
  }, [queryResult?.isSubmitted]);

  return (
    <>
      <div className="ml-20 flex">
        <div className="p-4">Food diary for:</div>
        <DateSelector date={date ? date : formatCurrentDate()} />
      </div>
      <div className="flex">
        <FoodLogView
          tableData={queryResult ? queryResult.foodLog : null}
          loading={isLoading}
          dateString={urlDate}
          refetchData={refetch}
        />
        <div className="flex-col justify-center items-center border border-black rounded-lg gap-5">
          <div className="p-2">
            <MacroChart data={queryResult ? queryResult.totalMacros : null} />
          </div>
          <div className="p-2">
            <NutritionTarget
              data={queryResult ? queryResult.totalMacros : null}
              goalsData={userInfoResult ? userInfoResult.macroTarget : null}
            />
          </div>
        </div>
      </div>
      <div className="flex items-start mt-3 gap-5">

        
      <MacroSubmissionForm refetch={refetch} submissionDate={urlDate} />
      <SearchSavedFood
        data={userInfoResult ? userInfoResult.savedFoods : null}
        submissionDate={urlDate}
        refetch={refetch}
      />
      </div>
    </>
  );
};

export default MainPage;
