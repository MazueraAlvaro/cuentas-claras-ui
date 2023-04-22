import React, {
  ChangeEvent,
  ChangeEventHandler,
  useEffect,
  useState,
} from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import {
  MonthExpensesTable,
  onUpdateMonthExpenseProps,
} from "./MonthExpensesTable";
import { useMonthStore } from "../../stores/months.store";
import { MonthExpense, MonthIncome } from "../../interfaces/months.interface";
import {
  MonthIncomesTable,
  onUpdateIncomeProps,
} from "./MonthIncomesTable/MonthIncomesTable";

export const Dashboard: React.FC = () => {
  const month = useMonthStore((state) => state.month);
  const loadMonthByDate = useMonthStore((state) => state.loadMonthByDate);
  const openMonth = useMonthStore((state) => state.openMonth);
  const updateMonthIncome = useMonthStore((state) => state.updateMonthIncome);
  const updateMonthExpense = useMonthStore((state) => state.updateMonthExpense);
  const deleteMonthExpense = useMonthStore((state) => state.deleteMonthExpense);
  const deleteMonthIncome = useMonthStore((state) => state.deleteMonthIncome);

  const [selectedMonth, setSelectedMonth] = useState(
    `${new Date().getFullYear()}-${(new Date().getMonth() + 1)
      .toString()
      .padStart(2, "0")}-00`
  );
  const [showOpenMonth, setShowOpenMonth] = useState(false);

  useEffect(() => {
    loadMonthByDate(selectedMonth).catch(() => {
      setShowOpenMonth(true);
    });
  }, [selectedMonth, loadMonthByDate]);

  useEffect(() => {
    if (month) {
      setShowOpenMonth(false);
    }
  }, [month]);

  const getMonthsOptions = () => {
    return Array.from({ length: new Date().getMonth() + 2 }, (_, i) => {
      const date = new Date();
      date.setMonth(i + 1);
      return date;
    }).map((value, index) => (
      <option
        key={value.getFullYear() + "" + index}
        value={
          value.getFullYear() +
          "-" +
          value.getMonth().toString().padStart(2, "0") +
          "-00"
        }
      >
        {value.getFullYear() +
          "-" +
          value.getMonth().toString().padStart(2, "0")}
      </option>
    ));
  };

  const handleSelectMonthChange: ChangeEventHandler = (
    e: ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedMonth(e.target.value);
  };

  const handleOnDeleteMonthExpense = (monthExpense: MonthExpense) =>
    deleteMonthExpense(monthExpense.id);
  const handleOnDeleteMonthIncome = (monthIncome: MonthIncome) =>
    deleteMonthIncome(monthIncome.id);
  const handleUpdateMonthIncome = ({
    amount,
    received,
    monthIncome,
  }: onUpdateIncomeProps) => {
    updateMonthIncome(monthIncome.id, amount, received);
  };

  const handleUpdateMonthExpense = ({
    amount,
    paid,
    monthExpense,
  }: onUpdateMonthExpenseProps) => {
    updateMonthExpense(monthExpense.id, amount, paid);
  };

  const handleOnOpenMonth = () => {
    openMonth(selectedMonth);
  };

  return (
    <>
      <h1 className="mt-4">Pandel de Inicio</h1>
      <ol className="breadcrumb mb-4">
        <li className="breadcrumb-item active">Pandel de Inicio</li>
      </ol>
      <Card className="mb-4">
        <Card.Header className="d-flex justify-content-between">
          <Card.Title className="m-0 pt-2">
            <i className="fas fa-calendar me-1"></i>
            Mes{" "}
            {Intl.DateTimeFormat("es-CO", { month: "long" })
              .format(new Date(selectedMonth.replace("00", "02")))
              .toLocaleUpperCase() +
              " " +
              selectedMonth.slice(0, 4)}
          </Card.Title>
          <div>
            <div className="d-flex justify-content-between">
              <div>
                <Button
                  className="me-1"
                  variant="primary"
                  size="lg"
                  hidden={!showOpenMonth}
                  onClick={handleOnOpenMonth}
                >
                  Abrir Mes
                </Button>
              </div>
              <div>
                <Form.Select
                  onChange={handleSelectMonthChange}
                  value={selectedMonth}
                  size="lg"
                >
                  {getMonthsOptions()}
                </Form.Select>
              </div>
            </div>
          </div>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col sm={6}>
              {month && (
                <MonthExpensesTable
                  monthExpenses={month.monthExpenses}
                  onUpdateMonthExpense={handleUpdateMonthExpense}
                  onDeleteMonthExpense={handleOnDeleteMonthExpense}
                  totalExpenses={month.totalExpenses}
                  totalUnpaid={month.totalUnpaid}
                />
              )}
            </Col>
            <Col sm={6}>
              {month && (
                <MonthIncomesTable
                  monthIncomes={month.monthIncomes}
                  onDeleteMonthIncome={handleOnDeleteMonthIncome}
                  onUpdateMonthIncome={handleUpdateMonthIncome}
                  totalIncomes={month.totalIncomes}
                  currentBalance={month.currentBalance}
                  difference={month.difference}
                  totalRows={month.monthExpenses.length}
                />
              )}
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </>
  );
};
