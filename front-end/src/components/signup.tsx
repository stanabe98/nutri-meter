import React, { useEffect, useState } from "react";
import { message, Button } from "antd";
import {
  enterAllFields,
  passwordError,
  loginConfig,
  passwordMatchError,
} from "./helpers";
import { useNavigate } from "react-router-dom";
import CustomInput from "./custom-components/custom-input";
import PasswordInput from "./custom-components/custom-password-input";
import axios, { AxiosError } from "axios";
import { Snackbar } from "@mui/material";

const SignUp: React.FC<{ cb?: any }> = ({ cb }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setconfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);

  const navigate = useNavigate();

  const submitHandler = async () => {
    setLoading(true);
    if (
      email.trim() === "" ||
      password.trim() === "" ||
      confirmpassword.trim() === "" ||
      name.trim() === ""
    ) {
      setOpen(true);
      setErrorMessage(enterAllFields);
      setLoading(false);
      return;
    }
    if (password !== confirmpassword) {
      console.log("password mismatch");
      setOpen(true);
      setErrorMessage(passwordMatchError);
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.post(
        "/api/user/register",
        { name, email, password },
        loginConfig
      );
      setLoading(false);
      setOpenSuccess(true);
      setErrorMessage("Successfully registered, please login");
      setTimeout(() => {
        cb();
        return;
      }, 1000);
    } catch (error) {
      setLoading(false);
      const apiError = error as AxiosError<any>;
      if (apiError.response?.data.error === "400") {
        setOpen(true);
        setErrorMessage("User exists, try login");
        setTimeout(() => {
          cb();
        }, 1000);
      }
    }
  };

  const handleKeyDown = (e: any) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submitHandler();
    }
  };

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  return (
    <div>
      <div className="mx-2 pt-4 mb-4">
        <label className="required font-semibold">Name</label>

        <CustomInput
          moreStyles={"mt-1 mb-1 py-3 drop-shadow-md"}
          value={name}
          placeholder={"Email"}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="mx-2 mb-4">
        <label className="required font-semibold">Email</label>

        <CustomInput
          moreStyles={"mt-1 mb-1 py-3 drop-shadow-md"}
          value={email}
          placeholder={"Email"}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="mx-2 mb-4">
        <label className="required font-semibold">Password</label>

        <PasswordInput
          moreStyles={"mt-1 mb-1 drop-shadow-md"}
          placeholder={"Password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
      <div className="mx-2 mb-8">
        <label className="required font-semibold">Confirm Password</label>

        <PasswordInput
          moreStyles={"mt-1 mb-1 drop-shadow-md"}
          placeholder={"Password"}
          value={confirmpassword}
          onChange={(e) => setconfirmPassword(e.target.value)}
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
          Register
        </Button>
        <div>
          <Snackbar
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            open={open}
            autoHideDuration={2000}
            onClose={handleClose}
          >
            <div className="w-96 py-2 rounded-sm drop-shadow-md text-center bg-red-400">
              {errorMessage}
            </div>
          </Snackbar>

          <Snackbar
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            open={openSuccess}
            autoHideDuration={2000}
            onClose={handleClose}
          >
            <div className="w-96 py-2 rounded-sm drop-shadow-md text-center bg-green-600">
              {errorMessage}
            </div>
          </Snackbar>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
