import React, { useEffect } from "react";
import "./App.css";
import MainPage from "./Pages/main-page";
import HomePage from "./Pages/home-page";
import Dashboard from "./Pages/dashboard";
import Settings from "./Pages/settings";
import { Route, Routes } from "react-router-dom";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { Tabs, Tab } from "@mui/material";
import { Person2Outlined } from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";

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
  const navigate = useNavigate();
  useEffect(() => {
    location.pathname !== "/profile" ? setValue(0) : setValue(1);
  }, [location]);

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
      <div
        className="cursor-pointer w-56 text-end"
        onClick={() => navigate("/profile")}
      >
        <Person2Outlined />
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
                <Settings />
              </>
            }
          />
        </Routes>
      </QueryClientProvider>
    </div>
  );
}

export default App;
