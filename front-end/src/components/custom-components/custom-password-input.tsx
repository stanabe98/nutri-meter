import React, { useState } from "react";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import "./custom-input.css"

interface InputProps {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: any) => void;
  moreStyles?: string;
}

const PasswordInput: React.FC<InputProps> = ({
  placeholder,
  value,
  onChange,
  onKeyDown,
  moreStyles,
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <div
      className={`flex items-center rounded-md password-input-div  ${moreStyles}`}
    >
      <input
        placeholder={placeholder}
        type={visible ? "" : "password"}
        value={value}
        className="w-full  pl-2 py-2 w-full rounded-md mr-1 text-sm"
        onChange={onChange}
        onKeyDown={onKeyDown}
      />

      {visible ? (
        <EyeOutlined
          className="mr-2"
          style={{ fontSize: "0.9rem" }}
          onClick={() => setVisible(false)}
        />
      ) : (
        <EyeInvisibleOutlined
          className="mr-2"
          style={{ fontSize: "0.9rem" }}
          onClick={() => setVisible(true)}
        />
      )}
    </div>
  );
};

export default PasswordInput;
