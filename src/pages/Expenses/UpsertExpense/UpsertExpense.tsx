import React from "react";
import { Button, Modal } from "react-bootstrap";
import { ExpenseForm } from "../ExpenseForm";
import {
  Expense,
  ExpenseInitialValues,
} from "../../../interfaces/expenses.interface";
import axios from "axios";

interface UpsertExpenseProps {
  show: boolean;
  expense: Expense | null;
  setShow: (value: boolean) => void;
  onSuccess: (data: Expense) => void;
}

export const UpsertExpense: React.FC<UpsertExpenseProps> = ({
  show,
  expense,
  setShow,
  onSuccess,
}) => {
  const handleClose = () => {
    setShow(false);
  };
  const handleOnSubmit = (values: ExpenseInitialValues) => {
    const data = {
      ...values,
      expenseType: parseInt(values.expenseType.toString()),
      startAt: values.startAt === "" ? null : values.startAt,
      endAt: values.endAt === "" ? null : values.endAt,
    };

    const url = `${process.env.REACT_APP_API_URL}/api/expenses${
      expense ? "/" + expense.id : ""
    }`;

    return axios(url, {
      data,
      method: expense ? "patch" : "post",
    })
      .then(({ data }) => {
        onSuccess(data);
        return true;
      })
      .catch((reason) => {
        console.error(reason);
        return false;
      });
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
        <Modal.Title>{expense ? "Actualizar" : "Crear"} Gasto</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ExpenseForm onSubmit={handleOnSubmit} expense={expense} />
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
