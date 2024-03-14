import React, { useState } from "react";
import "./mui-input.css";

const MuiInput: React.FC<{
  label: string;
  styles?: string;
  [key: string]: any;
}> = ({ label, styles, ...rest }) => {
  const [focused, setFocused] = useState(false);
  const [value, setValue] = useState("");

  const handleFocus = () => {
    setFocused(true);
  };

  const handleBlur = () => {
    if (!value) {
      setFocused(false);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  return (
    <div
      className={`${styles} custom-input ${focused || value ? "focused" : ""}`}
    >
      <input
        className="input-field"
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={handleChange}
        {...rest}
      />
      <label className="input-label">{label}</label>
    </div>
  );
};

export default MuiInput;
