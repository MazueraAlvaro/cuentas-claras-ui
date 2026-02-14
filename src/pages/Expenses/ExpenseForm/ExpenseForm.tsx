import { Formik, FormikHelpers } from "formik";
import axios from "axios";
import { omit } from "lodash";
import { useEffect, useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import * as Yup from "yup";
import {
  Expense,
  ExpenseInitialValues,
  ExpenseType,
} from "../../../interfaces/expenses.interface";
import { env } from "../../../config/env";

interface ExpenseFormProps {
  expense: Expense | null;
  onSubmit: (values: ExpenseInitialValues) => Promise<boolean>;
}

export const ExpenseForm: React.FC<ExpenseFormProps> = ({
  expense,
  onSubmit,
}) => {
  const handleSubmit = (
    values: ExpenseInitialValues,
    { setSubmitting }: FormikHelpers<ExpenseInitialValues>,
  ) => {
    onSubmit(values).then(() => setSubmitting(false));
  };

  const [expenseTypes, setExpenseTypes] = useState<ExpenseType[]>([]);

  const getInitialValues = (): ExpenseInitialValues => {
    if (expense) {
      return {
        ...omit(expense, ["id"]),
        expenseType: expense.expenseType.id,
        startAt: expense.startAt ?? "",
        endAt: expense.endAt ?? "",
      };
    }
    return {
      name: "",
      description: "",
      amount: 0,
      isRecurring: false,
      startAt: "",
      endAt: "",
      dueDay: 1,
      expenseType: 0,
    };
  };

  const expenseFormSchema = Yup.object().shape({
    name: Yup.string().required("Requerido"),
    amount: Yup.number()
      .min(0, "Minimo 0")
      .integer("Debe ser numero entero")
      .required("Requerido"),
    isRecurring: Yup.boolean().required("Requerido"),
    startAt: Yup.date()
      .typeError("Fecha no válida")
      .when("isRecurring", {
        is: true,
        then: (schema) => schema.required("Requerido"),
      }),
    endAt: Yup.date().typeError("Fecha no válida"),
    dueDay: Yup.number()
      .integer("Debe ser un numero entero")
      .min(1, "Minimo 1")
      .max(31, "Maximo 31")
      .when("isRecurring", {
        is: true,
        then: (schema) => schema.required("Requerido"),
      }),
    expenseType: Yup.number()
      .required("Requerido")
      .min(1, "Seleccione un tipo de gasto"),
    description: Yup.string(),
  });

  useEffect(() => {
    axios
      .get(`${env?.REACT_APP_API_URL}/api/expenses/types`)
      .then(({ data }) => setExpenseTypes(data));
  }, []);

  return (
    <Formik
      onSubmit={handleSubmit}
      initialValues={getInitialValues()}
      validationSchema={expenseFormSchema}
    >
      {({ handleSubmit, handleChange, values, touched, errors }) => (
        <Form noValidate onSubmit={handleSubmit} id="expense-form">
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={3}>
              Nombre
            </Form.Label>
            <Col sm={9}>
              <Form.Control
                type="text"
                placeholder="Nombre del gasto"
                value={values.name}
                onChange={handleChange}
                isValid={touched.name && !errors.name}
                isInvalid={!!errors.name}
                name="name"
                autoComplete="off"
              />
              <Form.Control.Feedback type="invalid">
                {errors.name}
              </Form.Control.Feedback>
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={3}>
              Monto
            </Form.Label>
            <Col sm={9}>
              <Form.Control
                type="number"
                placeholder="Monto del gasto"
                value={values.amount}
                onChange={handleChange}
                isValid={touched.amount && !errors.amount}
                isInvalid={!!errors.amount}
                name="amount"
              />
              <Form.Control.Feedback type="invalid">
                {errors.amount}
              </Form.Control.Feedback>
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={3}>
              Recurrente
            </Form.Label>
            <Col sm={9}>
              <Form.Switch
                className="mt-2"
                placeholder="Recurrente"
                checked={values.isRecurring}
                onChange={handleChange}
                isValid={touched.isRecurring && !errors.isRecurring}
                isInvalid={!!errors.isRecurring}
                name="isRecurring"
                size={1}
              />
              <Form.Control.Feedback type="invalid">
                {errors.isRecurring}
              </Form.Control.Feedback>
            </Col>
          </Form.Group>
          {values.isRecurring && (
            <>
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm={3}>
                  Inicio
                </Form.Label>
                <Col sm={9}>
                  <Form.Control
                    type="text"
                    placeholder="Fecha inicio"
                    value={values.startAt}
                    onChange={handleChange}
                    isValid={touched.startAt && !errors.startAt}
                    isInvalid={!!errors.startAt}
                    name="startAt"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.startAt}
                  </Form.Control.Feedback>
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm={3}>
                  Fin
                </Form.Label>
                <Col sm={9}>
                  <Form.Control
                    type="text"
                    placeholder="Fecha fin"
                    value={values.endAt}
                    onChange={handleChange}
                    isValid={touched.endAt && !errors.endAt}
                    isInvalid={!!errors.endAt}
                    name="endAt"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.endAt}
                  </Form.Control.Feedback>
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm={3}>
                  Vencimiento
                </Form.Label>
                <Col sm={9}>
                  <Form.Control
                    type="number"
                    placeholder="Dia Vencimiento"
                    value={values.dueDay}
                    onChange={handleChange}
                    isValid={touched.dueDay && !errors.dueDay}
                    isInvalid={!!errors.dueDay}
                    name="dueDay"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.dueDay}
                  </Form.Control.Feedback>
                </Col>
              </Form.Group>
            </>
          )}
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={3}>
              Tipo
            </Form.Label>
            <Col sm={9}>
              <Form.Select
                value={values.expenseType}
                onChange={handleChange}
                isValid={touched.expenseType && !errors.expenseType}
                isInvalid={!!errors.expenseType}
                name="expenseType"
              >
                <option value={0}>Seleccione tipo de gasto</option>
                {expenseTypes.map((expense) => (
                  <option key={expense.id} value={expense.id}>
                    {expense.name}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.expenseType}
              </Form.Control.Feedback>
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={3}>
              Descripción
            </Form.Label>
            <Col sm={9}>
              <Form.Control
                as="textarea"
                placeholder="Descripción del gasto"
                value={values.description}
                onChange={handleChange}
                isValid={touched.description && !errors.description}
                isInvalid={!!errors.description}
                name="description"
              />
              <Form.Control.Feedback type="invalid">
                {errors.description}
              </Form.Control.Feedback>
            </Col>
          </Form.Group>
        </Form>
      )}
    </Formik>
  );
};
