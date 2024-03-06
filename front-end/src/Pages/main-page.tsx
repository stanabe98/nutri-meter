import React, { useEffect } from "react";
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

const MainPage = () => {
  const { date } = useParams<{ date: string }>();
  const { user } = useAuthContext();

  const navigate = useNavigate();

  const fetchFoodLog = async () => {
    if (user) {
      const { data } = await axios.get<any>(
        `/api/foodlog/${date}`,
        getConfig(user)
      );
    }
  };

  useEffect(() => {
    console.log("executing");
    if (date) {
      console.log("date");

      if (!isValidDate(date) || isCurrentDay(date)) {
        navigate("/user", { replace: true });
        return;
      }


    }
  }, [date]);

  return (
    <>
      <div className="header bg-blue-300 h-10 w-full m-auto flex items-center justify-center">
        Nutri-Meter
      </div>

      <div className="ml-20 flex">
        <div className="p-4">Food diary for:</div>
        <DateSelector date={date ? date : formatCurrentDate()} />
      </div>
      <FoodLogView/>


    </>
  );
};

export default MainPage;
