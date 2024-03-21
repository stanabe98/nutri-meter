import React, { useState, useEffect, useRef } from "react";
import { SetPropertyFunction } from "../stores/foodLogStore";

export const EditableDiv: React.FC<{
  value: string;
  selectedId: string;
  cellId: string;
  setEditedObservable: SetPropertyFunction;
}> = ({ value, selectedId, cellId, setEditedObservable }) => {
  const [editing, setEditing] = useState(false);
  const [currentValue, setValue] = useState(value);
  const [result, setResult] = useState("23");
  const [onfocus, setonFocus] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const notEditingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (onfocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [onfocus]);

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
              ref={inputRef}
              className={`w-3/4 text-sm ${!onfocus ? "hidden" : ""}`}
              type="text"
              onBlur={() => setonFocus(false)}
              value={currentValue}
              onChange={handleChange}
              pattern="[0-9+*\/()\-.]*"
            />
            <div
              className={`w-3/4 bg-slate-100 ${onfocus ? "hidden" : ""}`}
              onClick={() => setonFocus(true)}
            >
              {doCalulation(currentValue)}
            </div>
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
