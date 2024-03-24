import React, { useState, useEffect } from "react";
import { CustomFoods } from "./data/data-types";
import { Divider } from "@mui/material";
import SavedFoodItem from "./small-components/saved-food-item";
import SelectedItem from "./small-components/selected-food-item";
import { Search } from "@mui/icons-material";
import "./custom-components/custom-input.css";
const SearchSavedFood: React.FC<{
  data: CustomFoods[] | null;
  submissionDate: string;
  refetch: any;
}> = ({ data, submissionDate, refetch }) => {
  const [search, setSearch] = useState("");
  const [searchClose, setSearchClose] = useState(false);

  const [selectedFood, setSelectedFood] = useState<CustomFoods | null>(null);
  const [filterdItems, setFilteredItems] = useState<CustomFoods[] | []>(
    data ?? []
  );

  const filterElements = (query: string) => {
    const filteredData = data?.filter((s) =>
      s.foodInfo.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredItems(filteredData ?? []);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearch(query);
    if (query.trim() === "") {
      filterElements("");
    }
    // filterElements(query);
  };

  const searchClick = () => {
    filterElements(search);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      filterElements(search);
    }
  };

  useEffect(() => {
    filterElements(search);
  }, [data]);

  return (
    <div>
      <div className="flex justify-center">
        <div className="flex my-1">
          <input
            className="custom-input pl-2 rounded-md drop-shadow-sm"
            style={{ display: "inline" }}
            placeholder="Search saved foods"
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
          />
          <div onClick={searchClick} className="cursor-pointer ">
            <Search />
          </div>
        </div>
      </div>

      <div className="">
        {!searchClose ? (
          <div className="food-search-table overflow-y-scroll">
            <div
              style={{ backgroundColor: "#1fa1af" }}
              className="flex sticky top-0 drop-shadow-lg items-center header-div"
            >
              <div className="pl-1 name-div">Name</div>
              <div className=" amount-div">Amount</div>
              <div className="w-16 serving-div">Serving</div>
              <div className="w-16 macro-div">Calories</div>
              <div className="w-16 macro-div">Protein</div>
              <div className="w-16 macro-div">Carbs</div>
              <div className="w-16 macro-div">Fats</div>
            </div>
            {data &&
              filterdItems.map((element) => (
                <>
                  <SavedFoodItem
                    onClick={() => {
                      setSelectedFood(element);
                      setSearchClose(true);
                    }}
                    item={element}
                  />
                  <Divider />
                </>
              ))}
          </div>
        ) : (
          <>
            {selectedFood && (
              <SelectedItem
                submissionDate={submissionDate}
                data={selectedFood}
                refetch={refetch}
                cb={() => setSearchClose(false)}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SearchSavedFood;
