import React, { useEffect } from "react";
import { Card } from "react-bootstrap";
import { useExpensesStore } from "../../stores/expenses.store";
import { ExpensesTable } from "../../components/ExpensesTable";

export const Expenses: React.FC = () => {
  const loadExpenses = useExpensesStore((state) => state.loadExpenses);

  useEffect(() => {
    loadExpenses();
  }, [loadExpenses]);

  return (
    <>
      <h1 className="mt-4">Gastos</h1>
      <ol className="breadcrumb mb-4">
        <li className="breadcrumb-item active">Gastos</li>
      </ol>
      <Card className="mb-4">
        <Card.Header>
          <i className="fas fa-table me-1"></i>
          Gastos
        </Card.Header>
        <Card.Body>
          <ExpensesTable />
        </Card.Body>
      </Card>
    </>
  );
};
