import React from "react";

interface InputProps {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: () => {};
  moreStyles?: string;
}

const CustomInput: React.FC<InputProps> = ({
  placeholder,
  value,
  onChange,
  onKeyDown,
  moreStyles,
}) => {
  return (
    <div
      className={`flex items-center bg-slate-700 rounded-md custom-inputLogindiv border border-black ${moreStyles}`}
    >
      <input
        placeholder={placeholder}
        value={value}
        className="w-full bg-slate-700  pl-2 py-2 w-full rounded-md mr-1 text-white text-sm"
        onChange={onChange}
        onKeyDown={onKeyDown}
      />
    </div>
  );
};

export default CustomInput;
