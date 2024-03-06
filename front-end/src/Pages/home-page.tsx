import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import Login from "../components/login";
import Signup from "../components/signup";

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [login, setLogin] = useState(true);

  useEffect(() => {
    console.log(user)
    if (user) {
      navigate("/user");
    }
  }, [navigate]);
  return (
    <div className="">
      <div className="flex gap-1 items-center justify-center ">
        <button
          className="border border-black p-2 px-5"
          onClick={() => setLogin(true)}
        >
          Login
        </button>
        <button
          className="border border-black p-2 px-5"
          onClick={() => setLogin(false)}
        >
          Signup
        </button>
      </div>

      <div className="m-auto w-2/4 ">{login ? <Login /> : <Signup />}</div>
    </div>
  );
};

export default HomePage;
