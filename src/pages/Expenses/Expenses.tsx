import React, { useEffect, useState } from "react";
import { Button, Card } from "react-bootstrap";
import { useExpensesStore } from "../../stores/expenses.store";
import { ExpensesTable } from "./ExpensesTable";
import { CreateExpense } from "./CreateExpense";

export const Expenses: React.FC = () => {
  const loadExpenses = useExpensesStore((state) => state.loadExpenses);
  const [showCreate, setShowCreate] = useState(false);

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
          <div>
            <Button
              variant="success"
              size="sm"
              onClick={() => setShowCreate(true)}
            >
              <i className="fas fa-plus me-1"></i>
              Crear
            </Button>
          </div>
        </Card.Header>
        <Card.Body>
          <ExpensesTable />
        </Card.Body>
      </Card>
      <CreateExpense show={showCreate} setShow={setShowCreate} />
    </>
  );
};
