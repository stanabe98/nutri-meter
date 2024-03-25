import React, { useEffect } from "react";
import "./App.css";
import MainPage from "./Pages/main-page";
import HomePage from "./Pages/home-page";
import Dashboard from "./Pages/dashboard";
import SettingsPage from "./Pages/settings";
import { Settings } from "@mui/icons-material";
import { Navigate, Route, Routes } from "react-router-dom";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { Tabs, Tab, Divider } from "@mui/material";
import { Person2Outlined } from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { Dropdown, MenuProps } from "antd";
import { ItemType } from "antd/es/menu/hooks/useItems";
import { useAuthContext } from "./context/AuthContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchInterval: false,
    },
  },
});

const Header: React.FC = ({}) => {
  const location = useLocation();
  const [value, setValue] = React.useState(0);
  const { user } = useAuthContext();
  const navigate = useNavigate();
  useEffect(() => {
    if (location.pathname === "/settings") {
      setValue(2);
      return;
    }
    location.pathname !== "/profile" ? setValue(0) : setValue(1);
  }, [location]);

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  const dropdownItems: ItemType[] = [
    {
      label: (
        <div
          onClick={() => navigate("/settings")}
          className="h-14 w-28 flex app-menu-greet justify-center items-center text-md text-center
          -mx-4 -my-2 px-4 rounded-t-lg  border-gray-400"
        >
          {`Hi ${user?.name}`}
        </div>
      ),
      key: 1,
    },
    {
      type: "divider",
    },
    {
      label: (
        <div
          onClick={() => navigate("/settings")}
          className="h-8 w-28 flex app-menu-option justify-center items-center text-base
          -mx-4 -my-2 px-4 rounded-md  border-gray-400"
        >
          <Settings />
        </div>
      ),
      key: 1,
    },
    {
      type: "divider",
    },

    {
      label: (
        <div
          onClick={logoutHandler}
          className="h-8 text-center w-28 flex app-menu-option justify-center items-center text-base
          -mx-4 -my-2 px-4 rounded-md hover:bg-slate-500"
        >
          Logout
        </div>
      ),
      key: 2,
    },
  ];

  return (
    <div className="header app-header h-10 w-full m-auto flex items-center justify-between drop-shadow-md">
      <div className="flex">
        <Tabs
          value={value}
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
            label="Food diary"
            onClick={() => {
              setValue(0);
              navigate("/user");
            }}
          />
          <Tab
            label="Profile"
            onClick={() => {
              setValue(1);
              navigate("/profile");
            }}
          />
        </Tabs>
      </div>
      <span className="font-bold" style={{ textAlign: "center" }}>
        JUST-MACROS
      </span>
      <div className="w-56 text-end">
        <Dropdown
          placement="bottomRight"
          trigger={["click"]}
          menu={{ items: dropdownItems }}
        >
          <Person2Outlined className="mr-4 cursor-pointer" />
        </Dropdown>
      </div>
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path="/" element={<HomePage />} />

          <Route
            path="/user"
            element={
              <>
                <Header />
                <MainPage />
              </>
            }
          />
          <Route
            path="/profile"
            element={
              <>
                <Header />
                <Dashboard />
              </>
            }
          />

          <Route
            path="/user/:date"
            element={
              <>
                <Header />
                <MainPage />
              </>
            }
          />
          <Route
            path="/settings"
            element={
              <>
                <Header />
                <SettingsPage />
              </>
            }
          />
        </Routes>
      </QueryClientProvider>
    </div>
  );
}

export default App;
