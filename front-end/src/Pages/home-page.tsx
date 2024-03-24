import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import Login from "../components/login";
import Signup from "../components/signup";
import { Tabs, Tab } from "@mui/material";
import "../App.css";

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [login, setLogin] = useState(0);

  useEffect(() => {
    console.log(user);
    if (user) {
      navigate("/user");
    }
  }, [navigate, user]);
  return (
    <div className="">
      <div className="flex m-auto w-1/3 text-xl font-bold justify-center login-title">
        {" "}
        JUST-MACROS
      </div>
      <div className="flex m-auto w-1/3 login-header border-b border-gray-400 items-center justify-center drop-shadow-md ">
        <Tabs
          value={login}
          sx={{
            "& button:hover": { color: "#1fa1af" },
            "& button:active": { color: "#1fa1af" },
            "& button.Mui-selected": { color: "#1fa1af" },
          }}
          TabIndicatorProps={{
            sx: { backgroundColor: "#1fa1af", height: 4 },
          }}
          // onChange={handleChange}
          className=" text-blue-500"
          textColor="secondary"
          indicatorColor="secondary"
          aria-label="basic tabs example"
        >
          <Tab
            style={{ width: "16vw" }}
            label="Login"
            onClick={() => {
              setLogin(0);
            }}
          />
          <Tab
            style={{ width: "16vw" }}
            label="Register"
            onClick={() => {
              setLogin(1);
            }}
          />
        </Tabs>
      </div>

      <div className="m-auto w-1/3 login-container">
        {login === 0 ? <Login /> : <Signup cb={() => setLogin(0)} />}
      </div>
    </div>
  );
};

export default HomePage;
