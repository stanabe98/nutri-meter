import React, { useEffect, useState } from "react";
import { message, Button } from "antd";
import { enterAllFields, passwordError, loginConfig } from "./helpers";
import { useNavigate } from "react-router-dom";
import CustomInput from "./custom-components/custom-input";
import PasswordInput from "./custom-components/custom-password-input";
import axios from "axios";
import { useAuthContext } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [messageApi, contextHolder] = message.useMessage();
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const warningMessage = (message = "") => {
    messageApi.open({
      type: "warning",
      content: message,
      duration: 3,
    });
  };

  const submitHandler = async () => {
    setLoading(true);
    if (!email || !password) {
      warningMessage(enterAllFields);
      return;
    }
    try {
      const { data } = await axios.post(
        "/api/user/login",
        { email, password },
        loginConfig
      );
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      navigate("/user");
    } catch (error) {
      warningMessage(passwordError);
      setLoading(false);
    }
  };

  const handleKeyDown = (e: any) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submitHandler();
    }
  };

  return (
    <div>
      <div className="mx-2 pt-4 mb-4">
        <label className="required font-semibold">Email</label>

        <CustomInput
          moreStyles={"mt-1 mb-1 py-3 drop-shadow-md login-input"}
          value={email}
          placeholder={"Email"}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="mx-2 mb-8">
        <label className="required font-semibold">Password</label>

        <PasswordInput
          moreStyles={"mt-1 mb-1 drop-shadow-md"}
          placeholder={"Password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>

      <div className="mx-2">
        <Button
          className=" login-btn
          drop-shadow-md
          font-semibold text-lg flex w-full border-gray-400 border rounded-md  py-5 items-center justify-center"
          onClick={submitHandler}
          loading={loading}
        >
          Login
        </Button>
      </div>
    </div>
  );
};

export default Login;
