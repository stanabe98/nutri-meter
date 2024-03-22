import React from "react";
import "./custom-input.css";

interface InputProps {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: () => {};
  moreStyles?: string;
  type?: string;
  pattern?: string;
  [key: string]: any;
}

const CustomInput: React.FC<InputProps> = ({
  placeholder,
  value,
  onChange,
  onKeyDown,
  moreStyles,
  type,
  pattern,
  ...rest
}) => {
  return (
    <>
      <input
        placeholder={placeholder}
        value={value}
        type={type}
        className="custom-input w-full pl-2 py-[2px]  rounded-md text-sm"
        onChange={onChange}
        onKeyDown={onKeyDown}
        pattern={pattern}
        {...rest}
      />
    </>
  );
};

export default CustomInput;
