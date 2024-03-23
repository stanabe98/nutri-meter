import React, { useState } from "react";
import {
  getAccesstoken,
  getSearchFoodResult,
  FoodItem,
  getSearchFoodbyId,
  ServingsResult,
} from "./hooks/useFatSecretApi";
import SelectedApiItem from "./selected-api-item";
import "../components/small-components/styles.css"

const SearchFoodLibrary:React.FC<{submissionDate:string, refetch:any}> = ({submissionDate, refetch}) => {
  const [query, setQuery] = useState("");
  const [searchData, setSearchData] = useState<FoodItem[] | []>([]);
  const [selectedFoodId, setSelectedFoodId] = useState<string>("");
  const [servingInfo, setServingInfo] = useState<ServingsResult[] | []>([]);
  const [selectedFoodName, setSelectedFoodName] = useState("");

  const submitSearch = async () => {
    const result = await getSearchFoodResult(query);
    if (result) {
      setSearchData(result.foods.food);
    }
  };

  const submitSelectFood = async (foodId: string) => {
    const result = await getSearchFoodbyId(Number(foodId));
    setServingInfo(result?.food.servings.serving ?? []);
    setSelectedFoodName(
      `${result?.food.food_name ?? ""},${result?.food.food_type ?? ""}`
    );
    setSelectedFoodId(foodId);
  };

  return (
    <div>
      
      <input
        className="border border-gray-500 px-1 mx-2"
        value={query}
        placeholder="search database"
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={submitSearch} disabled={query === ""}>
        Search
      </button>
      {selectedFoodId === "" ? (
        <>
          {searchData.map((item) => (
            <div
              className="flex gap-3 cursor-pointer"
              onClick={() => submitSelectFood(item.food_id)}
            >
              <span>{item.brand_name?? item.food_type}</span>
              <span>{item.food_name}</span>
              <span>{item.food_description}</span>
            </div>
          ))}
        </>
      ) : (
        <>
          <SelectedApiItem
            refetch={refetch}
            data={servingInfo}
            foodName={selectedFoodName}
            foodId={selectedFoodId}
            submissionDate={submissionDate}
            cb={() => setSelectedFoodId("")}
          />
        </>
      )}
    </div>
  );
};

export default SearchFoodLibrary;
