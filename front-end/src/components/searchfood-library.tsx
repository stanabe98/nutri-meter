import React, { useState } from "react";
import Skeleton from "@mui/material/Skeleton";
import { Divider } from "@mui/material";
import {
  getAccesstoken,
  getSearchFoodResult,
  FoodItem,
  getSearchFoodbyId,
  ServingsResult,
} from "./hooks/useFatSecretApi";
import SelectedApiItem from "./selected-api-item";
import { Search } from "@mui/icons-material";
import "../components/custom-components/custom-input.css";

const SearchFoodLibrary: React.FC<{ submissionDate: string; refetch: any }> = ({
  submissionDate,
  refetch,
}) => {
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const [searchData, setSearchData] = useState<FoodItem[] | []>([]);
  const [selectedFoodId, setSelectedFoodId] = useState<string>("");
  const [servingInfo, setServingInfo] = useState<ServingsResult[] | []>([]);
  const [selectedFoodName, setSelectedFoodName] = useState("");

  const submitSearch = async () => {
    if (submittedQuery !== query) {
      console.log("submitted query", submittedQuery, "current", query);
      setLoading(true);
      setSearchData([]);
    }
    const result = await getSearchFoodResult(query);
    setSubmittedQuery(query);
    if (result) {
      setLoading(false);
      console.log("total number", result.foods.total_results);
      if (result.foods.total_results === "0") {
        console.log("exectuing");
        setSearchData([]);

        return;
      }
      setSearchData(result.foods.food);
    }
    setLoading(false);
  };

  const submitSelectFood = async (foodId: string) => {
    const result = await getSearchFoodbyId(Number(foodId));
    setServingInfo(result?.food.servings.serving ?? []);
    setSelectedFoodName(
      `${result?.food.food_name ?? ""},${result?.food.food_type ?? ""}`
    );
    setSelectedFoodId(foodId);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submitSearch();
    }
  };

  return (
    <div>
      <div className="flex my-1">
        <div className="flex w-full justify-center">
          <input
            className="custom-input pl-2 rounded-md "
            value={query}
            onKeyDown={handleKeyDown}
            placeholder="search database"
            onChange={(e) => setQuery(e.target.value)}
          />
          <div onClick={submitSearch} className="cursor-pointer ">
            <Search />
          </div>
        </div>
      </div>

      {selectedFoodId === "" ? (
        <div className="food-search-table overflow-hidden">
          <div className="flex sticky top-0  items-center food-list-header border-b border-gray-400">
            <div className="pl-1 header-name ">
              <span>Name</span>
            </div>
            <div className="header-description ">
              <span>Description</span>
            </div>
          </div>
          {loading && (
            <>
              {[...Array(12)].map((_) => (
                <div className="flex  ">
                  <div className="pl-1 result-name">
                    <Skeleton />
                  </div>
                  <div className="result-description">
                    <Skeleton />
                  </div>
                </div>
              ))}
            </>
          )}
          {searchData.length == 0 && submittedQuery !== "" && !loading && (
            <>No results matching query</>
          )}
          {searchData.map((item) => (
            <>
              <div
                className="flex gap-3 cursor-pointer food-list-item"
                onClick={() => submitSelectFood(item.food_id)}
              >
                <div className="pl-1 result-name ">
                  <span className="food-description">
                    {`${item.brand_name ?? item.food_type} ${item.food_name}`}
                  </span>
                </div>
                <div className="result-description">
                  <span className="food-description header-description-skeleton">
                    {item.food_description}
                  </span>
                </div>
              </div>
              <Divider />
            </>
          ))}
        </div>
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
