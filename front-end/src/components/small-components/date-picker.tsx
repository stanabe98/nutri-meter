import React from "react";
import { dayDateFormat, nextDate } from "../helpers";
import { CaretRightOutlined, CaretLeftFilled } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import MuiCalendar from "./mui-date-picker";

const DateSelector: React.FC<{ date: string }> = ({ date }) => {
  const navigate = useNavigate();

  const navigateNext = (date: string, decrease = false) => {
    const nextNav = nextDate(date, decrease);

    navigate(`/user/${nextNav}`);
  };

  return (
    <div className="flex items-center gap-1">
      <div
        onClick={() => {
          navigateNext(date, true);
        }}
      >
        <CaretLeftFilled />
      </div>
      <div className="w-64 text-center font-semibold ">{dayDateFormat(date)}</div>
      <div
        onClick={() => {
          navigateNext(date);
        }}
      >
        <CaretRightOutlined />
      </div>
      <MuiCalendar
        date={date}
        cb={(formattedDate) => navigate(`/user/${formattedDate}`)}
      />
    </div>
  );
};

export default DateSelector;
