import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import "./styles.css";
import React, { useState, useEffect } from "react";

const MuiCalendar: React.FC<{ date: string; cb?: (date: string) => any }> = ({
  date,
  cb,
}) => {
  const [value, setValue] = useState<Dayjs | null>(dayjs(date, "DD-MM-YYYY"));

  useEffect(() => {
    setValue(dayjs(date, "DD-MM-YYYY"));
  }, [date]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DesktopDatePicker
        slotProps={{
          layout: {
            sx: {
              ".MuiPickersDay-today": {
                color: "black",
                borderRadius: 20,
                borderWidth: 1,
                borderColor: "#1fa1af",
                border: "1px solid ",
                backgroundColor: "#1fa1af",
              },
              ".MuiPickersCalendarHeader-root": {
                color: "black",
                borderRadius: 20,
                borderWidth: 1,
                borderColor: "#1fa1af",
                border: "1px solid",
                backgroundColor: "#aedadf",
              },
            },
          },
        }}
        value={value}
        onChange={(newValue) => {
          setValue(newValue);
          const formattedDate = newValue?.format("DD-MM-YYYY");
          cb && formattedDate && cb(formattedDate);
        }}
        className=""
      />
    </LocalizationProvider>
  );
};

export default MuiCalendar;
