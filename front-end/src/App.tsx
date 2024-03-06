import React from "react";
import "./App.css";
import MainPage from "./Pages/main-page";
import HomePage from "./Pages/home-page";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route path="/user" element={<MainPage />} />
        <Route path="/user/:date" element={<MainPage />} />
      </Routes>
    </div>
  );
}

export default App;
