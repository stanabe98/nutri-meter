import React, { useState } from "react";
import { CustomFoods } from "./data/data-types";
import SavedFoodItem from "./small-components/saved-food-item";
import SelectedItem from "./small-components/selected-food-item";

const SearchSavedFood: React.FC<{ data: CustomFoods[] | null , submissionDate:string, refetch:any}> = ({
  data,submissionDate, refetch
}) => {
  const [search, setSearch] = useState("");
  const [searchClose, setSearchClose] = useState(false);

  const [selectedFood, setSelectedFood] = useState<CustomFoods | null>(null);

  return (
    <div>
      <input
        style={{ display: "inline-block" }}
        placeholder="Search saved foods"
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="h-[200px] overflow-y-scroll w-[500px]">
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
              data.map((element) => (
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
          <>{selectedFood && <SelectedItem
            submissionDate={submissionDate}
            data={selectedFood} 
            refetch={refetch}
            cb={()=>setSearchClose(false)}
            />}</>
        )}
      </div>
    </div>
  );
};

export default SearchSavedFood;
