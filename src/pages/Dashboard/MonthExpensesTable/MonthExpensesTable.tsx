import {
  Badge,
  Button,
  Form,
  OverlayTrigger,
  Table,
  Tooltip,
} from "react-bootstrap";
import {
  MonthExpense,
  MonthStatus,
} from "../../../interfaces/months.interface";
import { currencyFormat } from "../../../utils/currency-format";
import { ChangeEvent, useState } from "react";
import { Expense } from "../../../interfaces/expenses.interface";
import { MonthExpenseAddRow } from "../MonthExpenseAddRow";

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
  monthStatus: MonthStatus;
}

export const MonthExpensesTable: React.FC<MonthExpenseTableProps> = ({
  monthExpenses,
  onUpdateMonthExpense,
  onDeleteMonthExpense,
  onAddMonthExpense,
  totalExpenses,
  totalUnpaid,
  monthStatus,
}) => {
  //States
  const [editMonthExpense, setEditMonthExpense] = useState<MonthExpense>();
  const [editAmountInput, setEditAmountInput] = useState<number>(0);
  const [editPaidInput, setEditpaidInput] = useState<boolean>(false);
  const handleEditMonthIncome = (monthExpense: MonthExpense) => {
    setEditMonthExpense(monthExpense);
    setEditAmountInput(monthExpense.amount);
    setEditpaidInput(monthExpense.paid);
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
                  {monthStatus === MonthStatus.OPEN &&
                    (editMonthExpense &&
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
                    ))}
                  {monthStatus === MonthStatus.OPEN &&
                    (editMonthExpense &&
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
                    ))}
                </td>
              </tr>
            );
          })}
        {monthStatus === MonthStatus.OPEN && monthExpenses && (
          <MonthExpenseAddRow
            onAddMonthExpense={onAddMonthExpense}
            monthExpenses={monthExpenses}
          />
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
