import React, { useState, useEffect } from "react";
import { CustomFoods } from "./data/data-types";
import SavedFoodItem from "./small-components/saved-food-item";
import SelectedItem from "./small-components/selected-food-item";
import { Search } from "@mui/icons-material";

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

  const handleKeyDown=(e:React.KeyboardEvent<HTMLInputElement>)=>{
     if (e.key === "Enter") {
       e.preventDefault();
       filterElements(search)
     }
  }

  useEffect(() => {
    filterElements(search);
  }, [data]);

  return (
    <div>
      <div className="flex">
        <input
          style={{ display: "inline" }}
          placeholder="Search saved foods"
          onChange={handleSearchChange}
          onKeyDown={handleKeyDown}
        />
        <div onClick={searchClick} className="cursor-pointer ">
          <Search />
        </div>
      </div>
      <div className="h-2/5 overflow-y-scroll w-[500px]">
        {!searchClose ? (
          <>
            <div className="flex sticky top-0 bg-cyan-500">
              <div className="w-32">Name</div>
              <div className="w-16">Amount</div>
              <div className="w-16">Serving</div>
              <div className="w-16">Calories</div>
              <div className="w-16">Protein</div>
              <div className="w-16">Carbs</div>
              <div className="w-16">Fats</div>
            </div>
            {data &&
              filterdItems.map((element) => (
                <SavedFoodItem
                  onClick={() => {
                    setSelectedFood(element);
                    setSearchClose(true);
                  }}
                  item={element}
                />
              ))}
          </>
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
