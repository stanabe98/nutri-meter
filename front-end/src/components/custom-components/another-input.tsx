import React, { useState } from "react";
import "./targets-input.css";

const TargetsInput: React.FC<{
  placeholder: any;
  styles?: string;
  [key: string]: any;
}> = ({ placeholder, styles, ...rest }) => {

  return (
    <div
      className={`${styles} custom-input`}
    >
      <input
        type="number"
        className="input-field h-8"
        {...rest}
      />
      <label className="input-label">{placeholder}</label>
    </div>
  );
};

export default TargetsInput;
