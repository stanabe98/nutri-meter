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
  const [result, setResult] = useState("23");
  const notEditingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setEditing(selectedId === cellId);
  }, [selectedId]);

  const handleChange = (event: any) => {
    const inputValue = event.target.value;
    const filteredValue = inputValue.replace(/[^0-9+*\/()\-.]/g, ""); // Allow only numbers and specified operators
    setValue(filteredValue);
    setEditedObservable(value, filteredValue);
  };

  const doCalulation = (val: string) => {
    try {
      const res = eval(val);
      return res;
    } catch (err) {
      return 0;
    }
  };

  return (
    <>
      <>
        {editing ? (
          <div className="">
            <input
              className="w-24"
              type="text"
              value={currentValue}
              onChange={handleChange}
              pattern="[0-9+*\/()\-.]*"
            />
          </div>
        ) : (
          <div style={{ cursor: "pointer" }} className="not-editing text-center">
            {doCalulation(currentValue)}
          </div>
        )}
      </>
    </>
  );
};
