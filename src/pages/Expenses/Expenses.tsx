import React, { useEffect } from "react";
import { Button, Card } from "react-bootstrap";
import { useExpensesStore } from "../../stores/expenses.store";
import { ExpensesTable } from "./ExpensesTable";

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
        <Card.Header className="d-flex justify-content-between">
          <Card.Title className="m-0">
            <i className="fas fa-table me-1"></i>
            Gastos
          </Card.Title>
          <div >
            <Button size="sm">
              <i className="fas fa-plus"></i>
              Crear
            </Button>
          </div>
        </Card.Header>
        <Card.Body>
          <ExpensesTable />
        </Card.Body>
      </Card>
    </>
  );
};
