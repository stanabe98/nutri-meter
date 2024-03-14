import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { CurrentUser, FoodInfo, CustomFoodInfo } from "../data/data-types";
import { getConfig, postConfig } from "../helpers";
import { error } from "console";
import UserFoodStore from "../stores/foodLogStore";
import { OptionalCaloriesFoodInfo } from "./useGetUserInfo";

const getUserFromStorage = () => {
  const userString = localStorage.getItem("userInfo");
  if (!userString) {
    return null;
  }
  const user = JSON.parse(userString);
  return user;
};

export const getCurrentUserInfo = async () => {
  const user = getUserFromStorage();
  if (!user) {
    return;
  }

  const { data: currentUserData } = await axios.get<CurrentUser>(
    `/api/user/currentuser`,
    getConfig(user)
  );

  if (currentUserData instanceof Array) {
    return null;
  }

  return currentUserData;
};

export const useGetCurrentUserInfo = (
  config?: UseQueryOptions<CurrentUser | null | undefined>
) => {
  const query = useQuery({
    queryKey: ["saved-foods"],
    queryFn: async () => {
      const result = await getCurrentUserInfo();

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

export const addtoSavedFood = async (food: CustomFoodInfo) => {
  const user = getUserFromStorage();
  if (!user) {
    return;
  }
  const { data } = await axios.post<CurrentUser>(
    `/api/user/currentuser/food/add`,
    { food: food },
    postConfig(user)
  );
};
export const editSavedFood = async (food: OptionalCaloriesFoodInfo, modifyId: string) => {
  const user = getUserFromStorage();
  if (!user) {
    return;
  }
  const { data } = await axios.post<CurrentUser>(
    `/api/user/currentuser/food/add`,
    { food: food, modifyId: modifyId },
    postConfig(user)
  );
};

export const deleteSavedFood = async (modifyId: string) => {
  const user = getUserFromStorage();
  if (!user) {
    return;
  }
  const { data } = await axios.post<CurrentUser>(
    `/api/user/currentuser/food/add`,
    { modifyId: [modifyId] },
    postConfig(user)
  );
};
