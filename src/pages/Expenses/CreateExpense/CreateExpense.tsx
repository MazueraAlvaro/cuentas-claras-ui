import React from "react";
import { Button, Modal } from "react-bootstrap";
import { ExpenseForm } from "../ExpenseForm";

interface CreateExpenseProps {
  show: boolean;
  setShow: (value: boolean) => void;
}

export const CreateExpense: React.FC<CreateExpenseProps> = ({
  show,
  setShow,
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
        <ExpenseForm />
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
