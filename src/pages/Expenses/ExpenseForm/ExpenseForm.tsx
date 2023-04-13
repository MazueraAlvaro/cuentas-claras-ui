import { Formik, FormikHelpers, FormikValues } from "formik";
import { ExpenseInitialValues } from "../../../interfaces/expenses.interface";
import { Col, Form, Row } from "react-bootstrap";
import * as Yup from "yup";

export const ExpenseForm: React.FC = () => {
  const handleSubmit = (
    values: FormikValues,
    { setSubmitting }: FormikHelpers<ExpenseInitialValues>
  ) => {
    console.log(values);
    setSubmitting(false);
  };

  const initialValues: ExpenseInitialValues = {
    name: "",
    description: "",
    amount: 0,
    isRecurring: true,
    startAt: "",
    endAt: "",
    dueDay: 1,
    expenseType: null,
  };

  const expenseFormSchema = Yup.object().shape({
    name: Yup.string().required("Requerido"),
    amount: Yup.number()
      .min(0, "Minimo 0")
      .integer("Debe ser numero entero")
      .required("Requerido"),
  });

  return (
    <Formik
      onSubmit={handleSubmit}
      initialValues={initialValues}
      validationSchema={expenseFormSchema}
    >
      {({ handleSubmit, handleChange, values, touched, errors }) => (
        <Form noValidate onSubmit={handleSubmit} id="expense-form">
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={2}>
              Nombre
            </Form.Label>
            <Col sm={10}>
              <Form.Control
                type="text"
                placeholder="Nombre"
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
            <Form.Label column sm={2}>
              Monto
            </Form.Label>
            <Col sm={10}>
              <Form.Control
                type="number"
                placeholder="Monto"
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
        </Form>
      )}
    </Formik>
  );
};
