import React, { useState } from "react";
import "./input-calculator.css";

const InputCalculator: React.FC<{
  cb: (state: string) => any;
  cbEval: (state: string) => any;
  value: string;
  evalue: string;
  label: string;
  className: string;
  cbError: (state: boolean) => any;
}> = ({ cb, label, className, cbError, value, evalue, cbEval }) => {
  const [isFocused, setIsFocused] = useState(false);
  const handleChange = (event: any) => {
    const inputValue = event.target.value;
    if (/^[0-9]|^$/.test(inputValue)) {
      const filteredValue = inputValue.replace(/[^0-9+*\/()\-.]/g, "");

      cb(filteredValue);
      let result = filteredValue;
      try {
        result = eval(filteredValue);
        console.log("result", result);
        if (
          label.toLocaleLowerCase() === "carbs" ||
          label.toLocaleLowerCase() === "protein"
        ) {
          if (Number(result > 1000)) {
            result = "1000";
            cb(result);
          }
        }
        if (
          label.toLocaleLowerCase() === "fats"
        ) {
          if (Number(result > 222)) {
            result = "222";
            cb(result);
          }
        }
        if (
          label.toLocaleLowerCase() === "calories" &&
          result.toString().length > 4
        ) {
          console.log("yess");
          result = "9999";
          cb(result);
        }

        cbError(false);
      } catch (error) {
        cbError(true);
      }
      cbEval(result);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  return (
    <div>
      <span>{label}</span>
      <div className="custom-inputLoginDiv">
        <input
          className={`custom-inputLogin text-sm rounded-md ${className} `}
          type="text"
          onBlur={handleBlur}
          onFocus={handleFocus}
          value={isFocused ? value : ""}
          placeholder={evalue}
          onChange={handleChange}
          pattern="[0-9+*\/()\-.]*"
        />
      </div>
    </div>
  );
};

export default InputCalculator;
