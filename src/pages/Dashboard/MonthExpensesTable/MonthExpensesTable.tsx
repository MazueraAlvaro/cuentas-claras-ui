import {
  Badge,
  Button,
  Form,
  OverlayTrigger,
  Table,
  Tooltip,
} from "react-bootstrap";
import { MonthExpense } from "../../../interfaces/months.interface";
import { currencyFormat } from "../../../utils/currency-format";
import { ChangeEvent, useEffect, useState } from "react";
import { useExpensesStore } from "../../../stores/expenses.store";
import { Expense } from "../../../interfaces/expenses.interface";

export interface onUpdateMonthExpenseProps {
  monthExpense: MonthExpense;
  amount: number;
  paid: boolean;
}

interface MonthExpenseTableProps {
  monthExpenses: MonthExpense[];
  onUpdateMonthExpense: (data: onUpdateMonthExpenseProps) => void;
  onDeleteMonthExpense: (monthExpense: MonthExpense) => void;
  onAddMonthExpense: (monthExpense: Expense) => void;
  totalExpenses: number;
  totalUnpaid: number;
}

export const MonthExpensesTable: React.FC<MonthExpenseTableProps> = ({
  monthExpenses,
  onUpdateMonthExpense,
  onDeleteMonthExpense,
  onAddMonthExpense,
  totalExpenses,
  totalUnpaid,
}) => {
  //Stores
  const loadExpenses = useExpensesStore((state) => state.loadExpenses);
  const expenses = useExpensesStore((state) => state.expenses);
  //States
  const [editMonthExpense, setEditMonthExpense] = useState<MonthExpense>();
  const [editAmountInput, setEditAmountInput] = useState<number>(0);
  const [editPaidInput, setEditpaidInput] = useState<boolean>(false);
  const handleEditMonthIncome = (monthExpense: MonthExpense) => {
    setEditMonthExpense(monthExpense);
    setEditAmountInput(monthExpense.amount);
    setEditpaidInput(monthExpense.paid);
  };
  const [showAddMonthExpense, setShowAddMonthExpense] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense>();
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>();

  useEffect(() => {
    if (expenses) {
      const filteredOptions = expenses.filter(
        (expense: Expense) =>
          !monthExpenses.some(
            (monthExpense) => monthExpense.expense.id === expense.id
          )
      );
      setFilteredExpenses(filteredOptions);
      setSelectedExpense(filteredOptions[0]);
    }
  }, [expenses, monthExpenses]);

  //Helpers
  const buildExpensesOptions = () => {
    return (
      <>
        {filteredExpenses &&
          filteredExpenses.map((expense) => (
            <option key={expense.id} value={expense.id}>
              {expense.name}
            </option>
          ))}
      </>
    );
  };

  //Handlers
  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEditAmountInput(parseInt(e.target.value));
  };
  const handlePaidInput = (e: ChangeEvent<HTMLInputElement>) => {
    setEditpaidInput(e.target.checked);
  };
  const handleSaveEditMonthIncome = () => {
    if (editMonthExpense) {
      onUpdateMonthExpense({
        monthExpense: editMonthExpense,
        amount: editAmountInput,
        paid: editPaidInput,
      });
    }
    setEditMonthExpense(undefined);
  };
  const handleCancelEditMonthIncome = () => {
    setEditMonthExpense(undefined);
  };
  const handleAddMonthExpense = () => {
    loadExpenses();
    setShowAddMonthExpense(true);
  };
  const handleConfirmAddMonthExpense = () => {
    if (selectedExpense) onAddMonthExpense(selectedExpense);
    setShowAddMonthExpense(false);
  };
  const handleCancelAddMonthExpense = () => {
    setShowAddMonthExpense(false);
  };
  const handleChangeExpense = (e: ChangeEvent<HTMLSelectElement>) => {
    const expense = expenses.find(
      (expense) => parseInt(e.target.value) === expense.id
    );
    setSelectedExpense(expense);
  };
  return (
    <Table>
      <thead>
        <tr>
          <th colSpan={5} className="text-center">
            <h5>Gastos</h5>
          </th>
        </tr>
        <tr>
          <th>No.</th>
          <th>Nombre</th>
          <th>Cantidad</th>
          <th>Pagado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {monthExpenses &&
          monthExpenses.map((monthExpense, index) => {
            return (
              <tr key={monthExpense.id}>
                <td>{index + 1}</td>
                <td>
                  <OverlayTrigger
                    placement="top"
                    overlay={
                      <Tooltip>{monthExpense.expense.description}</Tooltip>
                    }
                  >
                    <span>{monthExpense.expense.name}</span>
                  </OverlayTrigger>
                </td>
                <td className="text-right">
                  {editMonthExpense &&
                  editMonthExpense.id === monthExpense.id ? (
                    <Form.Control
                      type="number"
                      value={editAmountInput}
                      onChange={handleAmountChange}
                    />
                  ) : (
                    currencyFormat(monthExpense.amount)
                  )}
                </td>
                <td>
                  {editMonthExpense &&
                  editMonthExpense.id === monthExpense.id ? (
                    <Form.Check // prettier-ignore
                      type="switch"
                      className="mt-2"
                      checked={editPaidInput}
                      onChange={handlePaidInput}
                    />
                  ) : (
                    <Badge pill bg={monthExpense.paid ? "success" : "danger"}>
                      {monthExpense.paid ? "SI" : "NO"}
                    </Badge>
                  )}
                </td>
                <td>
                  {editMonthExpense &&
                  editMonthExpense.id === monthExpense.id ? (
                    <Button
                      size="sm"
                      className="me-1"
                      variant="success"
                      onClick={() => handleSaveEditMonthIncome()}
                      as="span"
                    >
                      <i className="fas fa-check"></i>
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      className="me-1"
                      onClick={() => handleEditMonthIncome(monthExpense)}
                    >
                      <i className="fas fa-edit"></i>
                    </Button>
                  )}
                  {editMonthExpense &&
                  editMonthExpense.id === monthExpense.id ? (
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={handleCancelEditMonthIncome}
                      as="span"
                    >
                      <i className="fas fa-xmark"></i>
                    </Button>
                  ) : (
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => onDeleteMonthExpense(monthExpense)}
                    >
                      <i className="fas fa-trash"></i>
                    </Button>
                  )}
                </td>
              </tr>
            );
          })}
        {monthExpenses && (
          <tr>
            <td>{showAddMonthExpense && monthExpenses.length + 1}</td>
            <td>
              {showAddMonthExpense && (
                <Form.Select
                  value={selectedExpense?.id}
                  onChange={handleChangeExpense}
                >
                  {buildExpensesOptions()}
                </Form.Select>
              )}
            </td>
            <td>
              {showAddMonthExpense &&
                selectedExpense &&
                currencyFormat(selectedExpense.amount)}
            </td>
            <td></td>
            <td>
              {!showAddMonthExpense ? (
                <Button
                  size="sm"
                  className="me-1"
                  variant="success"
                  as="span"
                  onClick={handleAddMonthExpense}
                >
                  <i className="fas fa-plus"></i>
                </Button>
              ) : (
                <>
                  <Button
                    size="sm"
                    className="me-1"
                    variant="success"
                    onClick={handleConfirmAddMonthExpense}
                  >
                    <i className="fas fa-check"></i>
                  </Button>
                  <Button
                    size="sm"
                    className="me-1"
                    variant="danger"
                    onClick={handleCancelAddMonthExpense}
                  >
                    <i className="fas fa-xmark"></i>
                  </Button>
                </>
              )}
            </td>
          </tr>
        )}
      </tbody>
      <tfoot>
        <tr>
          <th colSpan={2}>TOTAL</th>
          <td>{currencyFormat(totalExpenses)}</td>
        </tr>
        <tr>
          <th colSpan={2}>TOTAL SIN PAGAR</th>
          <td>{currencyFormat(totalUnpaid)}</td>
        </tr>
        <tr>
          <th colSpan={2}>TOTAL PAGADO</th>
          <td>{currencyFormat(totalExpenses - totalUnpaid)}</td>
        </tr>
      </tfoot>
    </Table>
  );
};
