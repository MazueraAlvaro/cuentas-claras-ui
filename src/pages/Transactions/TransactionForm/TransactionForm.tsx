import React from "react";
import { Button, Form, Modal } from "react-bootstrap";
import {
  Transaction,
  TransactionCategory,
} from "../../../interfaces/transactions.interface";
import { Formik, FormikHelpers } from "formik";
import * as Yup from "yup";

interface TransactionFormProps {
  show: boolean;
  transaction: Partial<Transaction> | null;
  transactionCategoryOptions: TransactionCategory[];
  creditCardLastDigits: string;
  onClose: () => void;
  onSave: (transaction: TransactionInitialValues) => Promise<boolean>;
}

export interface TransactionInitialValues {
  amount: number;
  datetime: string;
  category: string;
  merchant: string;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({
  show,
  transaction,
  transactionCategoryOptions,
  creditCardLastDigits,
  onClose,
  onSave,
}) => {
  const handleSubmit = (
    values: TransactionInitialValues,
    { setSubmitting }: FormikHelpers<TransactionInitialValues>,
  ) => {
    onSave(values).then(() => setSubmitting(false));
  };

  const getInitialValues = () => {
    return {
      amount: transaction?.amount || 0,
      datetime: transaction?.datetime || "",
      category:
        transaction?.category?.id.toString() ||
        transactionCategoryOptions[0].id.toString(),
      merchant: transaction?.merchant || "",
    };
  };

  const transactionFormSchema = Yup.object().shape({
    amount: Yup.number().required("Requerido").min(0, "Minimo 0"),
    datetime: Yup.string().required("Requerido"),
    category: Yup.string().required("Requerido"),
    merchant: Yup.string().required("Requerido"),
  });

  return (
    <Modal show={show} onHide={onClose} backdrop="static" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {transaction ? "Editar Transacción" : "Nueva Transacción"} para *
          {creditCardLastDigits}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          onSubmit={handleSubmit}
          initialValues={getInitialValues()}
          validationSchema={transactionFormSchema}
        >
          {({ values, handleChange, handleSubmit, touched, errors }) => (
            <Form onSubmit={handleSubmit} id="transaction-form">
              <Form.Group className="mb-3" controlId="merchant">
                <Form.Label>Comercio</Form.Label>
                <Form.Control
                  type="text"
                  name="merchant"
                  value={values.merchant}
                  isValid={touched.merchant && !errors.merchant}
                  isInvalid={!!errors.merchant}
                  onChange={(e) => {
                    handleChange(e);
                  }}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.merchant}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3" controlId="amount">
                <Form.Label>Monto</Form.Label>
                <Form.Control
                  type="number"
                  name="amount"
                  value={values.amount}
                  onChange={(e) => {
                    handleChange(e);
                  }}
                  isValid={touched.amount && !errors.amount}
                  isInvalid={!!errors.amount}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.amount}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3" controlId="datetime">
                <Form.Label>Fecha y Hora</Form.Label>
                <Form.Control
                  type="datetime-local"
                  name="datetime"
                  value={values.datetime}
                  onChange={(e) => {
                    handleChange(e);
                  }}
                  isValid={touched.datetime && !errors.datetime}
                  isInvalid={!!errors.datetime}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.datetime}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3" controlId="category">
                <Form.Label>Categoría</Form.Label>
                <Form.Select
                  name="category"
                  value={values.category}
                  onChange={(e) => {
                    handleChange(e);
                  }}
                  isValid={touched.category && !errors.category}
                  isInvalid={!!errors.category}
                >
                  {transactionCategoryOptions.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.category}
                </Form.Control.Feedback>
              </Form.Group>
            </Form>
          )}
        </Formik>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancelar
        </Button>
        <Button variant="primary" type="submit" form="transaction-form">
          Guardar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
