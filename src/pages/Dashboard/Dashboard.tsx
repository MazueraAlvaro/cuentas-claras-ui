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
import {
  MonthExpense,
  MonthIncome,
  MonthStatus,
  isMonthExpense,
  isMonthIncome,
} from "../../interfaces/months.interface";
import {
  MonthIncomesTable,
  onUpdateIncomeProps,
} from "./MonthIncomesTable/MonthIncomesTable";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { Expense } from "../../interfaces/expenses.interface";
import { Income } from "../../interfaces/incomes.interface";

export const Dashboard: React.FC = () => {
  const month = useMonthStore((state) => state.month);
  const loadMonthByDate = useMonthStore((state) => state.loadMonthByDate);
  const openMonth = useMonthStore((state) => state.openMonth);
  const closeMonth = useMonthStore((state) => state.closeMonth);
  const updateMonthIncome = useMonthStore((state) => state.updateMonthIncome);
  const updateMonthExpense = useMonthStore((state) => state.updateMonthExpense);
  const deleteMonthExpense = useMonthStore((state) => state.deleteMonthExpense);
  const deleteMonthIncome = useMonthStore((state) => state.deleteMonthIncome);
  const addMonthExpense = useMonthStore((state) => state.addMonthExpense);
  const addMonthIncome = useMonthStore((state) => state.addMonthIncome);

  const [selectedMonth, setSelectedMonth] = useState(
    `${new Date().getFullYear()}-${(new Date().getMonth() + 1)
      .toString()
      .padStart(2, "0")}-00`
  );
  const [showOpenMonth, setShowOpenMonth] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmDialogText, setConfirmDialogText] = useState("");
  const [monthElementToDelete, setMonthElementToDelete] = useState<
    MonthExpense | MonthIncome
  >();

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
    return [-1, 0 , 1].map((i) => {
      const date = new Date();
      date.setMonth(date.getMonth() + i);
      return date;
    }).map((value, index) => (
      <option
        key={value.getFullYear() + "" + index}
        value={
          value.getFullYear() +
          "-" +
          (value.getMonth() + 1).toString().padStart(2, "0") +
          "-00"
        }
      >
        {value.getFullYear() +
          "-" +
          (value.getMonth() + 1).toString().padStart(2, "0")}
      </option>
    ));
  };

  const handleSelectMonthChange: ChangeEventHandler = (
    e: ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedMonth(e.target.value);
  };

  const handleOnDeleteMonthExpense = (monthExpense: MonthExpense) => {
    setShowConfirmDialog(true);
    setConfirmDialogText(
      "Está seguro de eliminar el gasto: " + monthExpense.expense.name
    );
    setMonthElementToDelete(monthExpense);
  };
  const handleOnDeleteMonthIncome = (monthIncome: MonthIncome) => {
    setShowConfirmDialog(true);
    setConfirmDialogText(
      "Está seguro de eliminar el ingreo: " + monthIncome.income.name
    );
    setMonthElementToDelete(monthIncome);
  };
  const handleOnDialogConfirm = () => {
    if (monthElementToDelete) {
      if (isMonthIncome(monthElementToDelete)) {
        deleteMonthIncome(monthElementToDelete.id);
      } else if (isMonthExpense(monthElementToDelete)) {
        deleteMonthExpense(monthElementToDelete.id);
      }
    } else {
      closeMonth();
    }
    setShowConfirmDialog(false);
  };

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
    creditCard,
  }: onUpdateMonthExpenseProps) => {
    updateMonthExpense(monthExpense.id, amount, paid, creditCard);
  };

  const handleOnOpenMonth = () => {
    openMonth(selectedMonth);
  };

  const handleAddMonthExpense = (expense: Expense) => {
    addMonthExpense(expense.id);
  };

  const handleAddMonthIncome = (income: Income) => {
    addMonthIncome(income.id);
  };

  const handleOnCloseMonth = () => {
    const isAllExpensesPaid = month?.monthExpenses.every(
      (monthExpense) => monthExpense.paid
    );
    setShowConfirmDialog(true);
    setConfirmDialogText(
      isAllExpensesPaid
        ? "Está seguro que desea cerrar el mes?"
        : "Aún hay gastos por pagar, está seguro que desea cerrar el mes?"
    );
    setMonthElementToDelete(undefined);
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
                <Button
                  className="me-1"
                  variant="danger"
                  size="lg"
                  hidden={!month || month?.status === MonthStatus.CLOSE}
                  onClick={handleOnCloseMonth}
                >
                  Cerrar Mes
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
                  onAddMonthExpense={handleAddMonthExpense}
                  totalExpenses={month.totalExpenses}
                  totalUnpaid={month.totalUnpaid}
                  monthStatus={month.status}
                />
              )}
            </Col>
            <Col sm={6}>
              {month && (
                <MonthIncomesTable
                  monthIncomes={month.monthIncomes}
                  onDeleteMonthIncome={handleOnDeleteMonthIncome}
                  onUpdateMonthIncome={handleUpdateMonthIncome}
                  onAddMonthIncome={handleAddMonthIncome}
                  totalIncomes={month.totalIncomes}
                  currentBalance={month.currentBalance}
                  difference={month.difference}
                  totalRows={month.monthExpenses.length}
                  monthStatus={month.status}
                />
              )}
            </Col>
          </Row>
        </Card.Body>
      </Card>
      <ConfirmDialog
        show={showConfirmDialog}
        setShow={setShowConfirmDialog}
        onConfirm={handleOnDialogConfirm}
        text={confirmDialogText}
      />
    </>
  );
};
