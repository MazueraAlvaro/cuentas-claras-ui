import { Card } from "react-bootstrap";
import { AccumulatedTable } from "./AccumulatedTable";
import { Expense } from "../../interfaces/expenses.interface";
import { AccumulatedExpense } from "./AccumulatedExpense";
import { useState } from "react";

export const Accumulated: React.FC = () => {
  const [selectedExpense, setSelectedExpense] = useState<Partial<Expense>>();
  const [showAccumulatedExpense, setShowAccumulatedExpense] =
    useState<boolean>(false);
  const handleExpenseAccumulated = (expense: Partial<Expense>) => {
    setSelectedExpense(expense);
    setShowAccumulatedExpense(true);
  };
  return (
    <>
      <h1 className="mt-4">Acumulados</h1>
      <ol className="breadcrumb mb-4">
        <li className="breadcrumb-item active">Acumulados</li>
      </ol>
      <Card className="mb-4">
        <Card.Header className="d-flex justify-content-between">
          <Card.Title className="m-0">
            <i className="fas fa-table me-1"></i>
            Acumulados
          </Card.Title>
        </Card.Header>
        <Card.Body>
          <AccumulatedTable
            onViewExpenseAccumulated={handleExpenseAccumulated}
          />
        </Card.Body>
      </Card>
      {selectedExpense && (
        <AccumulatedExpense
          show={showAccumulatedExpense}
          setShow={setShowAccumulatedExpense}
          expense={selectedExpense}
        />
      )}
    </>
  );
};
