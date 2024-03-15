import React, { useState } from "react";
import "./mui-input.css";

const MuiInput: React.FC<{
  label: string;
  styles?: string;
  value: string;
  [key: string]: any;
  
}> = ({ label, styles, value, ...rest }) => {
  const [focused, setFocused] = useState(false);

  const handleFocus = () => {
    setFocused(true);
  };

  const handleBlur = () => {
    if (!value) {
      setFocused(false);
    }
  };



  return (
    <div
      className={`${styles} custom-input ${focused || value ? "focused" : ""}`}
    >
      <input
        className="input-field"
        onFocus={handleFocus}
        onBlur={handleBlur}
        value={value}
        {...rest}
      />
      <label className="input-label">{label}</label>
    </div>
  );
};

export default MuiInput;
