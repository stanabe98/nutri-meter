import React, { useState } from "react";

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
    <div className="">
      <span>{label}</span>
      <input
        className={` text-sm ${className} `}
        type="text"
        onBlur={handleBlur}
        onFocus={handleFocus}
        value={isFocused ? value : ""}
        placeholder={evalue}
        onChange={handleChange}
        pattern="[0-9+*\/()\-.]*"
      />
    </div>
  );
};

export default InputCalculator;
