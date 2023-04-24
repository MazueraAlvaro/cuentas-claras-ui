import { ChangeEvent, useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useExpensesStore } from "../../../stores/expenses.store";
import { Expense } from "../../../interfaces/expenses.interface";
import { MonthExpense } from "../../../interfaces/months.interface";
import { currencyFormat } from "../../../utils/currency-format";

interface MonthExpenseAddRowProps {
  monthExpenses: MonthExpense[];
  onAddMonthExpense: (monthExpense: Expense) => void;
}

export const MonthExpenseAddRow: React.FC<MonthExpenseAddRowProps> = ({
  monthExpenses,
  onAddMonthExpense,
}) => {
  //Stores
  const loadExpenses = useExpensesStore((state) => state.loadExpenses);
  const expenses = useExpensesStore((state) => state.expenses);

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

  const handleAddMonthExpense = () => {
    if (expenses.length === 0) loadExpenses();
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
  );
};
