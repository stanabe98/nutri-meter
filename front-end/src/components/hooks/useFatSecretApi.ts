import axios, { AxiosError } from "axios";
const baseURL = "https://platform.fatsecret.com/rest/server.api";

export interface FoodSearchResult {
  foods: FoodsResult;
}

export interface FoodsResult {
  food: FoodItem[];
  max_results: string;
  page_number: string;
  total_results: string;
}

export interface FoodItem {
  brand_name: string;
  food_description: string;
  food_id: string;
  food_name: string;
  food_type: string;
}

export interface FoodSearchIdResult {
  food: FoodIdResult;
}

export interface FoodIdResult {
  food_id: string;
  food_name: string;
  food_type: string;
  servings: {
    serving: ServingsResult[];
  };
}

export interface ServingsResult {
  calories: string;
  carbohydrate: string;
  fat: string;
  protein: string;
  serving_id: string;
  serving_description: string;
  measurement_description: string;
  metric_serving_amount: string;
  metric_serving_unit: string;
}

export const getAccesstoken = async () => {
  const url = "/api/fatsecret/getaccess";
  await axios.get(url);
};

export const getSearchFoodResult = async (query: string, max_results = 10) => {
  const url = `/api/fatsecret?query=${query}&max_results=${max_results}`;

  try {
    const { data } = await axios.get<FoodSearchResult>(url);

    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.data === "No Auth") {
        console.log("create cookie");
        await getAccesstoken();
        try {
          const { data: refetchedData } = await axios.get<FoodSearchResult>(
            url
          );
          console.log("refetched..");
          return refetchedData;
        } catch (error) {
          console.log(error);
          return;
        }
      }
    }
  }
};

export const getSearchFoodbyId = async (foodId: number) => {
  const url = `/api/fatsecret/getfood?food_id=${foodId}`;

  try {
    const { data } = await axios.get<FoodSearchIdResult>(url);

    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.data === "No Auth") {
        console.log("create cookie");
        await getAccesstoken();
        try {
          const { data: refetchedData } = await axios.get<FoodSearchIdResult>(
            url
          );
          console.log("refetched..");
          return refetchedData;
        } catch (error) {
          console.log(error);
          return;
        }
      }
    }
  }
};
