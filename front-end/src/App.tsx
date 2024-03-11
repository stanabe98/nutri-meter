import React from "react";
import "./App.css";
import MainPage from "./Pages/main-page";
import HomePage from "./Pages/home-page";
import Dashboard from "./Pages/dashboard";
import { Route, Routes } from "react-router-dom";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { Tabs, Tab } from "@mui/material";
import { Person2Outlined } from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";

const queryClient = new QueryClient();

const Header: React.FC = ({}) => {
  const location = useLocation();
  const [value, setValue] = React.useState(
    location.pathname !== "/profile" ? 0 : 1
  );
  const navigate = useNavigate();

  return (
    <div className="header bg-blue-300 h-10 w-full m-auto flex items-center justify-between">
      <div className="flex">
        <Tabs
          value={value}
          // onChange={handleChange}
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
      <span style={{ textAlign: "center" }}>Just-Macros</span>
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
        </Routes>
      </QueryClientProvider>
    </div>
  );
}

export default App;
