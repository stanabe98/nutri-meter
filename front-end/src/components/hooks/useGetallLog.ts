import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import axios from "axios";

import { getConfig, postConfig } from "../helpers";


interface UserAllFoodLogs {
  date: string;
  totalMacros?: TotalMacros;
  _id: string;
}

interface TotalMacros {
  totalProtein: number;
  totalCalories: number;
  totalFats: number;
  totalCarbs: number;
}

export const getAllFoodLogs = async () => {
  const userString = localStorage.getItem("userInfo");
  if (!userString) {
    return;
  }
  const user = JSON.parse(userString);
  const { data: userFoodData } = await axios.get<UserAllFoodLogs[]>(
    `/api/foodlog`,
    getConfig(user)
  );

  if (userFoodData.length === 0) {
    return null;
  }

  return userFoodData;
};

export const useGetAllFoodLogs = (
  config?: UseQueryOptions<UserAllFoodLogs[] | null | undefined>
) => {
  const query = useQuery({
    queryKey: ["UserAllFoodLogs"],
    queryFn: async () => {
      const result = await getAllFoodLogs();

      return result;
    },
    ...config,
  });

  return {
    error: query.error,
    queryResult: query.data,
    isLoading: query.isLoading,
    refetch: query.refetch,
  };
};
