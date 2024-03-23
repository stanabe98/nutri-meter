import React, { useState } from "react";
import { Tabs, Tab } from "@mui/material";
import SearchSavedFood from "./add-saved";
import { CustomFoods } from "./data/data-types";
import SearchFoodLibrary from "./searchfood-library";
import "./table.css"

const SearchSelect: React.FC<{
  data: CustomFoods[] | null;
  submissionDate: string;
  refetch: any;
}> = ({ data, submissionDate, refetch }) => {
  const [value, setValue] = useState(0);
  return (
    <div>
      <div className="flex justify-center w-full tab-panel text-center drop-shadow-md">
        <Tabs
          value={value}
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
          <Tab
            className="w-64"
            onClick={() => setValue(0)}
            label="Saved Foods"
          />
          <Tab className="w-64" onClick={() => setValue(1)} label="Search" />
        </Tabs>
      </div>
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
