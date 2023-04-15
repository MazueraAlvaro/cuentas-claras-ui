import React, { useEffect, useState } from "react";
import { Alert, Button, Card } from "react-bootstrap";
import { useExpensesStore } from "../../stores/expenses.store";
import { ExpensesTable } from "./ExpensesTable";
import { UpsertExpense } from "./UpsertExpense";
import { Expense } from "../../interfaces/expenses.interface";

export const Expenses: React.FC = () => {
  const loadExpenses = useExpensesStore((state) => state.loadExpenses);
  const addExpense = useExpensesStore((state) => state.addExpense);
  const [upsertExpense, setUpsertExpense] = useState<Expense | null>(null);
  const [showUpsert, setShowUpsert] = useState(false);
  const [alertData, setAlertData] = useState({
    variant: "",
    text: "",
    show: false,
  });

  useEffect(() => {
    loadExpenses();
  }, [loadExpenses]);

  const handleSuccessCreate = (expense: Expense) => {
    if (upsertExpense) {
      loadExpenses();
    } else {
      addExpense(expense);
    }
    setShowUpsert(false);
    setAlertData({
      variant: "success",
      text: `Gasto ${expense ? "actualizado" : "creado"} exitosamente`,
      show: true,
    });
    setTimeout(() => setAlertData({ ...alertData, show: false }), 2500);
  };

  const handleOnEditExpense = (expense: Expense) => {
    setShowUpsert(true);
    setUpsertExpense(expense);
  };

  return (
    <>
      <h1 className="mt-4">Gastos</h1>
      <ol className="breadcrumb mb-4">
        <li className="breadcrumb-item active">Gastos</li>
      </ol>
      <Alert variant={alertData.variant} show={alertData.show}>
        {alertData.text}
      </Alert>
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
              onClick={() => setShowUpsert(true)}
            >
              <i className="fas fa-plus me-1"></i>
              Crear
            </Button>
          </div>
        </Card.Header>
        <Card.Body>
          <ExpensesTable onEditExpense={handleOnEditExpense} />
        </Card.Body>
      </Card>
      <UpsertExpense
        show={showUpsert}
        setShow={setShowUpsert}
        onSuccess={handleSuccessCreate}
        expense={upsertExpense}
      />
    </>
  );
};
