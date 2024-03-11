import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { UserFoodLog, FoodInfo } from "../data/data-types";
import { getConfig, postConfig } from "../helpers";
import { error } from "console";
import UserFoodStore from "../stores/foodLogStore";

interface OptionalCaloriesFoodInfo extends Omit<FoodInfo, "calories"> {
  calories?: string;
}

export const getUserFoodLog = async (dateString: string) => {
  const userString = localStorage.getItem("userInfo");
  if (!userString) {
    
    return;
  }
  const user = JSON.parse(userString);
  const { data: userFoodData } = await axios.get<UserFoodLog>(
    `/api/foodlog/${dateString}`,
    getConfig(user)
  );

  if (userFoodData instanceof Array) {
    return null;
  }

  return userFoodData;
};

export const modifyUserFoodLog = async (
  modifyId: string,
  dateString: string,
  refetch:any
) => {
  const url = "/api/foodlog";

  const userString = localStorage.getItem("userInfo");
  if (!userString) {
  
    return;
  }
  const user = JSON.parse(userString);

  const foodData: OptionalCaloriesFoodInfo = {};

  if (UserFoodStore.editedCalories.trim() !== "")
    foodData.calories = UserFoodStore.editedCalories.trim();
  if (UserFoodStore.editedFoodName.trim() !== "")
    foodData.name = UserFoodStore.editedFoodName.trim();
  if (UserFoodStore.editedMeal.trim() !== "")
    foodData.meal = UserFoodStore.editedMeal.trim();
  if (UserFoodStore.editedFats.trim() !== "")
    foodData.fats = UserFoodStore.editedFats.trim();
  if (UserFoodStore.editedCarbs.trim() !== "")
    foodData.carbs = UserFoodStore.editedCarbs.trim();
  if (UserFoodStore.editedProtein.trim() !== "")
    foodData.protein = UserFoodStore.editedProtein.trim();

  try {
    const editFoodLog = await axios.post(
      url,
      {
        modifyId: modifyId,
        foodInfo: foodData,
        date: dateString,
      },
      postConfig(user)
    );
    UserFoodStore.resetEditingFields();
    refetch()
  } catch (error) {
    console.log(error);
  }
};

export const deleteUserFoodLog = async (
  dateString: string,
  foodIds: string,
  refetch:any
) => {
  const url = "/api/foodlog/deletelog";
  const userString = localStorage.getItem("userInfo");
  if (!userString) {
   
    return;
  }
  const user = JSON.parse(userString);

  try {
    const editFoodLog = await axios.post(
      url,
      {
        date: dateString,
        foodIds: [foodIds],
      },
      postConfig(user)
    );
    UserFoodStore.resetEditingFields();
    refetch()
  } catch (error) {
    console.log(error);
  }
};

interface useGetUserFoodLogProps {
  dataQueryKey: (string | number)[];
  dateString: string;
}

export const useGetUserFoodLog = (
  props: useGetUserFoodLogProps,
  config?: UseQueryOptions<UserFoodLog | null | undefined>
) => {
  const { dataQueryKey, dateString } = props;

  const query = useQuery({
    queryKey: [...dataQueryKey],
    queryFn: async () => {
      const result = await getUserFoodLog(dateString);
  
      return result;
    },
    ...config,
  });

  return {
    error: query.error,
    queryResult: query.data,
    isLoading: query.isLoading,
    refetch: () => {
      query.refetch();
    },
  };
};
