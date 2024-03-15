import React, { useState, useEffect } from "react";
import { useGetCurrentUserInfo } from "../hooks/userGetUserFoods";
import Skeleton from "@mui/material/Skeleton";
import {
  Edit,
  SaveOutlined,
  Delete,
  Cancel,
  Search,
} from "@mui/icons-material";
import { Box, IconButton, Input, Button } from "@mui/material";
import { CurrentUser, CustomFoods, FoodInfo } from "../data/data-types";
import MuiInput from "../custom-components/mui-input";
import TextField from "@mui/material/TextField";
import { OptionalCaloriesFoodInfo } from "../hooks/useGetUserInfo";
import { CustomFoodInfo } from "../data/data-types";
import "./styles.css";
import { Select } from "antd";
import {
  editSavedFood,
  deleteSavedFood,
  addtoSavedFood,
} from "../hooks/userGetUserFoods";

const SavedFoodsTable: React.FC<{
  queryResult: CurrentUser | null | undefined;
  refetch: any;
  isLoading: boolean;
}> = ({ queryResult, refetch, isLoading }) => {
  // const { queryResult, refetch, isLoading } = useGetCurrentUserInfo();
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [currentItems, setCurrentItems] = useState<CustomFoods[] | []>([]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const [search, setSearch] = useState("");
  const [edit, setEdit] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [quantity, setQuantity] = useState<number | string>("");
  const [serving, setServing] = useState<string>("");
  const [calories, setCalories] = useState<number | string>("");
  const [protein, setProtein] = useState<number | string>("");
  const [fats, setFats] = useState<number | string>("");
  const [carbs, setCarbs] = useState<number | string>("");
  const [selectedFood, setSelectedFood] = useState<any>({});

  const [addname, setaddName] = useState<string>("");
  const [addquantity, setaddQuantity] = useState<string>("");
  const [addserving, setaddServing] = useState<string>("");
  const [addcalories, setaddCalories] = useState<string>("");
  const [addprotein, setaddProtein] = useState<string>("");
  const [addfats, setaddFats] = useState<string>("");
  const [addcarbs, setaddCarbs] = useState<string>("");
  const [filteredResult, setFilteredResult] = useState<CustomFoods[] | []>([]);

  useEffect(() => {
    console.log("something");

    filterElements(search);

    if (queryResult) {
      // setCurrentItems(
      //   queryResult?.savedFoods.slice(indexOfFirstItem, indexOfLastItem)
      // );
      // setCurrentItems(filteredResult.slice(indexOfFirstItem, indexOfLastItem));
    }
  }, [queryResult, currentPage]);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const isEmpty = (obj: Record<string, any>) => {
    return Object.keys(obj).length === 0;
  };

  const saveEditEntry = async () => {
    const foodData: OptionalCaloriesFoodInfo = {};

    if (name !== "") foodData.name = name;
    if (quantity !== "") foodData.quantity = Number(quantity);
    if (serving !== "") foodData.measurement = serving;
    if (calories !== "") foodData.calories = calories.toString();
    if (protein !== "") foodData.protein = protein.toString();
    if (carbs !== "") foodData.carbs = carbs.toString();
    if (fats !== "") foodData.fats = fats.toString();

    if (isEmpty(foodData)) {
      console.log("returning");
      setEdit("");
      return;
    }

    console.log("edit Object", foodData);
    console.log("edit Id", edit);

    await editSavedFood(foodData, edit);
    setEdit("");
    refetch();
  };

  const deleteFoodEntry = async (deleteId: string) => {
    await deleteSavedFood(deleteId);
    setEdit("");
    refetch();
  };

  const addNewFood = async () => {
    const newEntry: CustomFoodInfo = {
      calories: addcalories,
      name: addname,
      quantity: Number(addquantity),
      measurement: addserving,
    };
    if (addprotein !== "") newEntry.protein = addprotein;
    if (addcarbs !== "") newEntry.carbs = addcarbs;
    if (addfats !== "") newEntry.fats = addfats;

    console.log("add object", newEntry);

    await addtoSavedFood(newEntry);
    setEdit("");
    setaddCarbs("");
    setaddFats("");
    setaddProtein("");
    setaddCalories("");
    setaddQuantity("");
    setaddServing("");
    setaddName("");

    filterElements("");
    setSearch("");

    refetch();
  };

  const handleSelect = (value: string) => {
    console.log("selecting", value);
    setaddServing(value);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    if (query.trim() === "") {
      filterElements("");
    }
    setSearch(query);
    // filterElements(query);
  };
  const searchClick = () => {
    filterElements(search);
  };

  const filterElements = (query: string) => {
    // Assuming your elements are stored in an array called `elements`
    const filtered = queryResult?.savedFoods.filter((element) =>
      element.foodInfo.name.toLowerCase().includes(query.toLowerCase())
    );
    console.log("filtered Res", filtered);
    setFilteredResult(filtered ?? []);
    if (filtered) {
      if (filtered.length <= itemsPerPage) {
        setCurrentItems(filtered);
        return;
      }
    }
    setCurrentItems(filtered?.slice(indexOfFirstItem, indexOfLastItem) ?? []);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      filterElements(search);
    }
  };

  return (
    <div className="border border-black px-5">
      <div className="flex">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={handleSearchChange}
          onKeyDown={handleKeyDown}
        />
        <div onClick={searchClick} className="cursor-pointer ">
          <Search />
        </div>
      </div>

      <div className="h-[150px] overflow-y-scroll border border-black">
        <div className="flex gap-1">
          <div className="w-32">Name</div>
          <div className="w-16">Amount</div>
          <div className="w-16">Serving</div>
          <div className="w-16">Calories</div>
          <div className="w-16">Protein</div>
          <div className="w-16">Fats</div>
          <div className="w-16">Carbs</div>
        </div>
        {queryResult && !isLoading && filterElements.length !== 0 ? (
          currentItems.map((item) => (
            <>
              {edit == item._id ? (
                <div className="flex gap-1" id={"food-entry-" + item._id}>
                  <input
                    defaultValue={item.foodInfo.name}
                    onChange={(e) => {
                      if (e.target.value.trim() === item.foodInfo.name.trim()) {
                        setName("");
                        return;
                      }
                      console.log("executing");
                      setName(e.target.value);
                    }}
                    placeholder="name"
                    className="w-32"
                  />
                  <input
                    defaultValue={item.foodInfo.quantity}
                    type="number"
                    onChange={(e) => {
                      if (
                        e.target.value.trim() ===
                        item.foodInfo.quantity.toString().trim()
                      ) {
                        setQuantity("");
                        return;
                      }
                      console.log("executing");

                      setQuantity(Number(e.target.value));
                    }}
                    placeholder="quantity"
                    className="w-16"
                  />
                  <input
                    defaultValue={item.foodInfo.measurement}
                    onChange={(e) => {
                      if (e.target.value === item.foodInfo.measurement) {
                        setServing("");
                        return;
                      }
                      console.log("executing");

                      setServing(e.target.value);
                    }}
                    placeholder="serving"
                    className="w-16"
                  />
                  <input
                    defaultValue={item.foodInfo.calories}
                    type="number"
                    onChange={(e) => {
                      if (e.target.value === item.foodInfo.calories) {
                        setCalories("");
                        return;
                      }
                      setCalories(e.target.value);
                    }}
                    placeholder="calories"
                    className="w-16"
                  />
                  <input
                    defaultValue={item.foodInfo.protein}
                    type="number"
                    onChange={(e) => {
                      if (e.target.value === item.foodInfo.protein) {
                        setProtein("");
                        return;
                      }
                      setProtein(e.target.value);
                    }}
                    placeholder="protein"
                    className="w-16"
                  />
                  <input
                    defaultValue={item.foodInfo.fats}
                    type="number"
                    onChange={(e) => {
                      if (e.target.value === item.foodInfo.fats) {
                        setFats("");
                        return;
                      }
                      setFats(e.target.value);
                    }}
                    placeholder="fats"
                    className="w-16"
                  />
                  <input
                    defaultValue={item.foodInfo.carbs}
                    type="number"
                    onChange={(e) => {
                      if (e.target.value === item.foodInfo.carbs) {
                        setCarbs("");
                        return;
                      }
                      setCarbs(e.target.value);
                    }}
                    placeholder="carbs"
                    className="w-16"
                  />
                  <div onClick={() => setEdit("")}>
                    <Cancel />
                  </div>
                  <div onClick={saveEditEntry}>
                    <SaveOutlined />
                  </div>
                  <div onClick={() => deleteFoodEntry(item._id)}>
                    <Delete />
                  </div>
                </div>
              ) : (
                <div className="flex gap-1" id={"food-entry" + item._id}>
                  <div className="w-32">{item.foodInfo.name}</div>
                  <div className="w-16 text-center">
                    {item.foodInfo.quantity}
                  </div>
                  <div className="w-16 ">{item.foodInfo.measurement}</div>
                  <div className="w-16 text-center">
                    {item.foodInfo.calories}
                  </div>
                  <div className="w-16 text-center">
                    {item.foodInfo.protein ?? "-"}
                  </div>
                  <div className="w-16 text-center">
                    {item.foodInfo.fats ?? "-"}
                  </div>
                  <div className="w-16 text-center">
                    {item.foodInfo.carbs ?? "-"}
                  </div>
                  <div
                    className="edit-icon"
                    onClick={() => {
                      setEdit(item._id);
                      setSelectedFood({
                        name: item.foodInfo.name,
                        quantity: item.foodInfo.quantity,
                        serving: item.foodInfo.measurement,
                        calories: item.foodInfo.calories,
                        protein: item.foodInfo.protein,
                        carbs: item.foodInfo.carbs,
                        fats: item.foodInfo.fats,
                      });
                    }}
                  >
                    <Edit />
                  </div>
                </div>
              )}
            </>
          ))
        ) : (
          <>
            <Skeleton />
            <Skeleton animation="wave" />
            <Skeleton animation={false} />
            <Skeleton animation={false} />
          </>
        )}
      </div>
      <div className="flex justify-end w-2/4 gap-1">
        {Array.from({
          length: Math.ceil(filteredResult.length / itemsPerPage),
        }).map((_, index) => (
          <button
            className="border border-black px-2"
            key={index}
            onClick={() => paginate(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
      <div className="flex gap-1 mt-5 ">
        <MuiInput
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setaddName(e.target.value.trim())
          }
          styles="w-32"
          value={addname}
          label="Name"
        />
        <MuiInput
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setaddQuantity(e.target.value)
          }
          value={addquantity}
          type="number"
          styles="w-16"
          label="Amount"
        />
        <Select
          className="w-16"
          defaultValue={addserving}
          onChange={handleSelect}
          options={[
            {
              value: "unit",
            },
            {
              value: "grams",
            },
          ]}
        />

        <MuiInput
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setaddCalories(e.target.value)
          }
          value={addcalories}
          type="number"
          styles="w-16"
          label="Calories"
        />
        <MuiInput
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setaddProtein(e.target.value)
          }
          value={addprotein}
          type="number"
          styles="w-16"
          label="Protein"
        />
        <MuiInput
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setaddFats(e.target.value)
          }
          value={addfats}
          type="number"
          styles="w-16"
          label="Fats"
        />
        <MuiInput
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setaddCarbs(e.target.value)
          }
          value={addcarbs}
          type="number"
          styles="w-16"
          label="Carbs"
        />
        <Button
          onClick={addNewFood}
          variant="outlined"
          className="h-8 bg-cyan-200"
          startIcon={<SaveOutlined />}
          disabled={
            addcalories.trim() === "" ||
            addname.trim() === "" ||
            addquantity.trim() === "" ||
            addserving === ""
          }
        >
          Add
        </Button>
      </div>
    </div>
  );
};

export default SavedFoodsTable;
