import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import { Dashboard } from "./pages/Dashboard";
import { Layout } from "./pages/Layout";
import { Expenses } from "./pages/Expenses";
import { Incomes } from "./pages/Incomes";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/incomes" element={<Incomes />} />
      </Route>
    </Routes>
  );
}

export default App;
