import { UserInfo } from "../context/AuthContext";
import dayjs from "dayjs";

export const passwordError = "Invaild email or password";
export const enterAllFields = "Please fill all fields ";
export const passwordMatchError = "Please ensure passwords match";

export const loginConfig = {
  headers: {
    "Content-type": "application/json",
  },
};

export const getConfig = (user: UserInfo) => {
  return {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  };
};

export const postConfig = (user: UserInfo) => {
  return {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${user.token}`,
    },
  };
};

export const isValidDate = (date: string) => {
  const parts = date.split("-"); // Assuming the format is always dd/mm/yyyy
  const day = parseInt(parts[0]);
  const month = parseInt(parts[1]);
  const year = parseInt(parts[2]);

  const isValidDate =
    !isNaN(day) &&
    !isNaN(month) &&
    !isNaN(year) &&
    month >= 1 &&
    month <= 12 &&
    day >= 1 &&
    day <= new Date(year, month, 0).getDate();

  return isValidDate;
};

export const urlDate = (date: string) => {
  const parts = date.split("/"); // Assuming the format is always dd/mm/yyyy
  const day = parseInt(parts[0]);
  const month = parseInt(parts[1]);
  const year = parseInt(parts[2]);

  const isValidDate =
    !isNaN(day) &&
    !isNaN(month) &&
    !isNaN(year) &&
    month >= 1 &&
    month <= 12 &&
    day >= 1 &&
    day <= new Date(year, month, 0).getDate();

  return urlDate;
};

export function formatDate(dateString: string) {
  const [day, month, year] = dateString.split("-");

  const formattedMonth = month.padStart(2, "0");
  const formattedDay = day.padStart(2, "0");
  return `${formattedDay}-${formattedMonth}-${year}`;
}

export const formatCurrentDate = () => {
  const currentDate = new Date();

  const day = String(currentDate.getDate()).padStart(2, "0");
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const year = currentDate.getFullYear();

  return `${day}-${month}-${year}`;
};

export const isCurrentDay = (dateString: string) => {
  const currentDate = dayjs();
  const parsedDate = dayjs(dateString, "D-M-YYYY");

  // Check if the parsed date is the same as the current date
  return currentDate.isSame(parsedDate, "day");
};

export const dayDateFormat = (date: string) => {
  const parts = date.split("-");
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const year = parseInt(parts[2], 10);

  const dateString = new Date(year, month, day);

  return dateString.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

export const nextDate = (dateString: string, decrease = false) => {
  const parts = dateString.split("-");
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const year = parseInt(parts[2], 10);

  const date = new Date(year, month, day);
  decrease
    ? date.setDate(date.getDate() - 1)
    : date.setDate(date.getDate() + 1);

  const incrementedDay = date.getDate();
  const incrementedMonth = date.getMonth() + 1;
  const incrementedYear = date.getFullYear();

  // Format incremented date parts with leading zeros if needed
  const formattedDay = String(incrementedDay).padStart(2, "0");
  const formattedMonth = String(incrementedMonth).padStart(2, "0");

  return `${formattedDay}-${formattedMonth}-${incrementedYear}`;
};
