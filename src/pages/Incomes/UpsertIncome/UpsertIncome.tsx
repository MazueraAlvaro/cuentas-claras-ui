import React from "react";
import axios from "axios";
import { Button, Modal } from "react-bootstrap";
import { IncomeForm } from "../IncomeForm";
import {
  Income,
  IncomeInitialValues,
} from "../../../interfaces/incomes.interface";
import { env } from "../../../config/env";

interface UpsertIncomeProps {
  show: boolean;
  income: Income | null;
  setShow: (value: boolean) => void;
  onSuccess: (data: Income) => void;
}

export const UpsertIncome: React.FC<UpsertIncomeProps> = ({
  show,
  income,
  setShow,
  onSuccess,
}) => {
  const handleClose = () => {
    setShow(false);
  };
  const handleOnSubmit = (values: IncomeInitialValues) => {
    const data = {
      ...values,
      incomeType: parseInt(values.incomeType.toString()),
      startAt: values.startAt === "" ? null : values.startAt,
      endAt: values.endAt === "" ? null : values.endAt,
    };

    const url = `${env?.REACT_APP_API_URL}/api/incomes${
      income ? "/" + income.id : ""
    }`;

    return axios(url, {
      data,
      method: income ? "patch" : "post",
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
        <Modal.Title>{income ? "Actualizar" : "Crear"} Ingreso</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <IncomeForm onSubmit={handleOnSubmit} income={income} />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancelar
        </Button>
        <Button form="income-form" type="submit" variant="primary">
          Guardar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
