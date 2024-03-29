import React, { useState, useEffect, useRef } from "react";
import { SetPropertyFunction } from "../stores/foodLogStore";

export const EditableCell: React.FC<{
  value: string;
  selectedId: string;
  cellId: string;
  setEditedObservable: SetPropertyFunction;
}> = ({ value, selectedId, cellId, setEditedObservable }) => {
  const [editing, setEditing] = useState(false);
  const [currentValue, setValue] = useState(value);
  const [isFocused, setIsFocused] = useState(false);
  const [eValue, setEvalue] = useState(currentValue);

  useEffect(() => {
    setEditing(selectedId === cellId);
  }, [selectedId]);

  const handleChange = (event: any) => {
    const inputValue = event.target.value;
    const filteredValue = inputValue.replace(/[^0-9+*\/()\-.]/g, "");

    setValue(filteredValue);
    let result = filteredValue;
    try {
      result = eval(filteredValue);
    } catch (error) {}
    setEvalue(result);

    setEditedObservable(value, filteredValue);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const doCalulation = (val: string) => {
    try {
      const res = eval(val);
      return res;
    } catch (err) {
      return 0;
    }
  };

   const handleFocus = () => {
     setIsFocused(true);
   };

  return (
    <>
      <>
        {editing ? (
          <div className="">
            <input
              className={`w-3/4 text-sm `}
              type="text"
              onBlur={handleBlur}
              onFocus={handleFocus}
              value={isFocused ? currentValue : ""}
              placeholder={eValue}
              onChange={handleChange}
              pattern="[0-9+*\/()\-.]*"
            />
          </div>
        ) : (
          <div
            style={{ cursor: "pointer" }}
            className="text-sm not-editing text-center"
          >
            {doCalulation(currentValue)}
          </div>
        )}
      </>
    </>
  );
};
