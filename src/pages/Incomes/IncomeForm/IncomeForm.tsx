import { Formik, FormikHelpers } from "formik";
import axios from "axios";
import { omit } from "lodash";
import { useEffect, useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import * as Yup from "yup";
import {
  Income,
  IncomeInitialValues,
  IncomeType,
} from "../../../interfaces/incomes.interface";

interface IncomeFormProps {
  income: Income | null;
  onSubmit: (values: IncomeInitialValues) => Promise<boolean>;
}

export const IncomeForm: React.FC<IncomeFormProps> = ({ income, onSubmit }) => {
  const handleSubmit = (
    values: IncomeInitialValues,
    { setSubmitting }: FormikHelpers<IncomeInitialValues>
  ) => {
    console.log(values);
    onSubmit(values).then(() => setSubmitting(false));
  };

  const [incomeTypes, setIncomeTypes] = useState<IncomeType[]>([]);

  const getInitialValues = (): IncomeInitialValues => {
    if (income) {
      return {
        ...omit(income, ["id"]),
        incomeType: income.incomeType.id,
        startAt: income.startAt ?? "",
        endAt: income.endAt ?? "",
      };
    }
    return {
      name: "",
      description: "",
      amount: 0,
      isRecurring: false,
      startAt: "",
      endAt: "",
      incomeType: 0,
    };
  };

  const incomeFormSchema = Yup.object().shape({
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
    incomeType: Yup.number()
      .required("Requerido")
      .min(1, "Seleccione un tipo de ingreso"),
    description: Yup.string(),
  });

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/incomes/types")
      .then(({ data }) => setIncomeTypes(data));
  }, []);

  return (
    <Formik
      onSubmit={handleSubmit}
      initialValues={getInitialValues()}
      validationSchema={incomeFormSchema}
    >
      {({ handleSubmit, handleChange, values, touched, errors }) => (
        <Form noValidate onSubmit={handleSubmit} id="income-form">
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={3}>
              Nombre
            </Form.Label>
            <Col sm={9}>
              <Form.Control
                type="text"
                placeholder="Nombre del ingreso"
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
                placeholder="Monto del ingreso"
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
            </>
          )}
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={3}>
              Tipo
            </Form.Label>
            <Col sm={9}>
              <Form.Select
                placeholder="Tipo de ingreso"
                value={values.incomeType}
                onChange={handleChange}
                isValid={touched.incomeType && !errors.incomeType}
                isInvalid={!!errors.incomeType}
                name="incomeType"
              >
                <option value={0}>Seleccione tipo de ingreso</option>
                {incomeTypes.map((income) => (
                  <option key={income.id} value={income.id}>
                    {income.name}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.incomeType}
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
                placeholder="Descripción del ingreso"
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
