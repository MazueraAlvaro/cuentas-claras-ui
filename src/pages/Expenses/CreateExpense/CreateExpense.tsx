import React from "react";
import { Button, Modal } from "react-bootstrap";
import { ExpenseForm } from "../ExpenseForm";
import { Expense } from "../../../interfaces/expenses.interface";

interface CreateExpenseProps {
  show: boolean;
  setShow: (value: boolean) => void;
  onSuccess: (data: Expense) => void;
}

export const CreateExpense: React.FC<CreateExpenseProps> = ({
  show,
  setShow,
  onSuccess,
}) => {
  const handleClose = () => {
    setShow(false);
  };
  return (
    <Modal
      show={show}
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Crear Gasto</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ExpenseForm onSuccess={onSuccess} />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancelar
        </Button>
        <Button form="expense-form" type="submit" variant="primary">
          Guardar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
