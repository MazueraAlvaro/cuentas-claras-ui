import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import { Dashboard } from "./pages/Dashboard";
import { Layout } from "./pages/Layout";
import { Expenses } from "./pages/Expenses";
import { Incomes } from "./pages/Incomes";
import { Accumulated } from "./pages/Accumulated";
import { Transactions } from "./pages/Transactions";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/incomes" element={<Incomes />} />
        <Route path="/accumulated" element={<Accumulated />} />
        <Route path="/transactions" element={<Transactions />} />
      </Route>
    </Routes>
  );
}

export default App;
