import React, { useEffect, useState } from "react";
import { Button, Card, Col, Modal, Row, Table } from "react-bootstrap";
import { Expense } from "../../../interfaces/expenses.interface";
import axios from "axios";
import { env } from "../../../config/env";
import { MonthPicker } from "../../../components/MonthPicker";
import { getDateFormatToApi } from "../../../utils/date-format";
import { ExpenseAccumulated } from "../../../interfaces/accumulated.interface";
import { currencyFormat } from "../../../utils/currency-format";

interface AccumulatedExpenseProps {
  show: boolean;
  expense: Partial<Expense>;
  setShow: (value: boolean) => void;
}

export const AccumulatedExpense: React.FC<AccumulatedExpenseProps> = ({
  show,
  expense,
  setShow,
}) => {
  const handleClose = () => {
    setShow(false);
  };
  const getInitialValue = (type: "from" | "to") => {
    if (type === "from") {
      const date = new Date();
      date.setMonth(0);
      return date;
    } else {
      return new Date();
    }
  };

  const [fromDate, setFrom] = useState<Date>(getInitialValue("from"));
  const [toDate, setTo] = useState<Date>(new Date());
  const [accumulated, setAccumulated] = useState<ExpenseAccumulated>();

  const [months, setMonths] =
    useState<Array<{ index: number; name: string; year: number }>>();

  const handleChange =
    (func: React.Dispatch<React.SetStateAction<Date>>) => (date: Date) =>
      func(date);

  useEffect(() => {
    (async () => {
      const { data } = await axios.get(
        `${env?.REACT_APP_API_URL}/api/accumulated/` + expense.id,
        {
          params: {
            from: getDateFormatToApi(fromDate),
            to: getDateFormatToApi(toDate),
          },
        }
      );
      setMonths(data.data.months);
      setAccumulated(data.data.data[0]);
    })();
  }, [toDate, fromDate, expense]);

  return (
    <Modal
      show={show}
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
      aria-labelledby="contained-modal-title-vcenter"
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          Historico del gasto <b>{expense.name}</b>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col md={12}>
            <Row className="justify-content-md-center">
              <Col md={4}>
                <MonthPicker
                  initialValue={getInitialValue("from")}
                  onChange={handleChange(setFrom)}
                  label="Desde"
                />
              </Col>
              <Col md={4}>
                <MonthPicker
                  initialValue={getInitialValue("to")}
                  onChange={handleChange(setTo)}
                  label="Hasta"
                />
              </Col>
            </Row>
            <Row className="mt-2">
              <Col md="4">
                <Card bg="primary" text="light">
                  <Card.Body>
                    <Card.Title>Total </Card.Title>
                    <Card.Text className="text-end fs-3">
                      {currencyFormat(accumulated?.total || 0)}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md="4">
                <Card bg="success" text="light">
                  <Card.Body>
                    <Card.Title>Total Pagado</Card.Title>
                    <Card.Text className="text-end fs-3">
                      {currencyFormat(accumulated?.totalPaid || 0)}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md="4">
                <Card bg="secondary" text="light">
                  <Card.Body>
                    <Card.Title>Total Sin Pagar</Card.Title>
                    <Card.Text className="text-end fs-3">
                      {currencyFormat(accumulated?.totalUnpaid || 0)}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <Table striped bordered hover className="mt-4">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Año</th>
                  <th>Mes</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {months &&
                  months.map((month, index) => {
                    return (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{month.year}</td>
                        <td>{month.name}</td>
                        <td>
                          {currencyFormat(
                            (accumulated &&
                              accumulated.months.find(
                                (accMonth) =>
                                  accMonth.paid &&
                                  accMonth.month === month.index &&
                                  accMonth.year === month.year
                              )?.amount) ||
                              0
                          )}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancelar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
