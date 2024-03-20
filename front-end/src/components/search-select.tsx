import React, { useState } from "react";
import { Tabs, Tab } from "@mui/material";
import SearchSavedFood from "./add-saved";
import { CustomFoods } from "./data/data-types";
import SearchFoodLibrary from "./searchfood-library";

const SearchSelect: React.FC<{
  data: CustomFoods[] | null;
  submissionDate: string;
  refetch: any;
}> = ({ data, submissionDate, refetch }) => {
  const [value, setValue] = useState(0);
  return (
    <div>
      <Tabs
        value={value}
        // onChange={handleChange}
        sx={{
          "& button:hover": { color: "#1fa1af" },
          "& button:active": { color: "#1fa1af" },
          "& button.Mui-selected": { color: "#1fa1af" },
        }}
        TabIndicatorProps={{
          sx: { backgroundColor: "#1fa1af", height: 4 },
        }}
        aria-label="basic tabs example"
      >
        <Tab onClick={() => setValue(0)} label="Saved Foods" />
        <Tab onClick={() => setValue(1)} label="Search" />
      </Tabs>
      {value === 0 ? (
        <SearchSavedFood
          data={data}
          submissionDate={submissionDate}
          refetch={refetch}
        />
      ) : (
        <SearchFoodLibrary refetch={refetch} submissionDate={submissionDate} />
      )}
    </div>
  );
};

export default SearchSelect;
