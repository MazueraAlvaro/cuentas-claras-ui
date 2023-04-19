import React, {
  ChangeEvent,
  ChangeEventHandler,
  useEffect,
  useState,
} from "react";
import { Card, Col, Form, Row } from "react-bootstrap";
import { MonthExpensesTable } from "./MonthExpensesTable";
import { useMonthStore } from "../../stores/months.store";
import { MonthExpense, MonthIncome } from "../../interfaces/months.interface";
import { MonthIncomesTable } from "./MonthIncomesTable/MonthIncomesTable";

export const Dashboard: React.FC = () => {
  const loadMonthByDate = useMonthStore((state) => state.loadMonthByDate);
  const month = useMonthStore((state) => state.month);

  const [selectedMonth, setSelectedMonth] = useState(
    `${new Date().getFullYear()}-${(new Date().getMonth() + 1)
      .toString()
      .padStart(2, "0")}-00`
  );

  useEffect(() => {
    loadMonthByDate(selectedMonth);
  }, [selectedMonth, loadMonthByDate]);

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

  const handleOnDeleteMonthExpense = (monthExpense: MonthExpense) => {};
  const handleOnEditMonthExpense = (monthExpense: MonthExpense) => {};
  const handleOnDeleteMonthIncome = (monthExpense: MonthIncome) => {};
  const handleOnEditMonthIncome = (monthExpense: MonthIncome) => {};

  return (
    <>
      <h1 className="mt-4">Pandel de Inicio</h1>
      <ol className="breadcrumb mb-4">
        <li className="breadcrumb-item active">Pandel de Inicio</li>
      </ol>
      <Card className="mb-4">
        <Card.Header className="d-flex justify-content-between">
          <Card.Title className="m-0">
            <i className="fas fa-calendar me-1"></i>
            Mes{" "}
            {Intl.DateTimeFormat("es-CO", { month: "long" })
              .format(new Date(selectedMonth.replace("00", "02")))
              .toLocaleUpperCase() +
              " " +
              selectedMonth.slice(0, 4)}
          </Card.Title>
          <div>
            <Form.Select
              onChange={handleSelectMonthChange}
              value={selectedMonth}
              size="lg"
            >
              {getMonthsOptions()}
            </Form.Select>
          </div>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col sm={6}>
              {month && (
                <MonthExpensesTable
                  monthExpenses={month.monthExpenses}
                  onEditMonthExpense={handleOnEditMonthExpense}
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
                  onEditMonthIncome={handleOnEditMonthIncome}
                  onDeleteMonthIncome={handleOnDeleteMonthIncome}
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
