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
      <form id="email">
        <label className="required text-sky-200">Email</label>

        <CustomInput
          moreStyles={"mt-1 mb-1"}
          value={email}
          placeholder={"Email"}
          onChange={(e) => setEmail(e.target.value)}
        />
      </form>
      <form id="password">
        <label className="required text-sky-200">Password</label>

        <PasswordInput
          moreStyles={"mt-1 mb-1"}
          placeholder={"Password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </form>

      <Button
        className=" flex w-full border-black border rounded-md mt-4 py-5 items-center justify-center"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        loading={loading}
      >
        Login
      </Button>
    </div>
  );
};

export default Login;
