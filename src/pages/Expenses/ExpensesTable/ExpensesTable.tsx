import { Badge, Button, OverlayTrigger, Table, Tooltip } from "react-bootstrap";
import { useExpensesStore } from "../../../stores/expenses.store";
import { Expense } from "../../../interfaces/expenses.interface";
import { currencyFormat } from "../../../utils/currency-format";

interface ExpensesTableProps {
  onEditExpense: (expense: Expense) => void;
  onDeleteExpense: (expense: Expense) => void;
}

export const ExpensesTable: React.FC<ExpensesTableProps> = ({
  onEditExpense,
  onDeleteExpense,
}) => {
  const expenses = useExpensesStore((state) => state.expenses);

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>#</th>
          <th>Nombre</th>
          <th>Monto</th>
          <th>Recurrente</th>
          <th>Dia Venc.</th>
          <th>Desde</th>
          <th>Hasta</th>
          <th>Tipo</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {expenses &&
          expenses.map((expense, index) => {
            return (
              <tr key={expense.id}>
                <td>{index + 1}</td>
                <td>
                  <OverlayTrigger
                    placement="right"
                    overlay={<Tooltip>{expense.description}</Tooltip>}
                  >
                    <span>{expense.name}</span>
                  </OverlayTrigger>
                </td>
                <td>{currencyFormat(expense.amount)}</td>
                <td>
                  <Badge pill bg="success">
                    {expense.isRecurring ? "SI" : "NO"}
                  </Badge>
                </td>
                <td>{expense.dueDay}</td>
                <td>
                  {expense.startAt
                    ? new Date(expense.startAt).toLocaleDateString()
                    : "No definido"}
                </td>
                <td>
                  {expense.endAt
                    ? new Date(expense.endAt).toLocaleDateString()
                    : "No definido"}
                </td>
                <td>{expense.expenseType.name}</td>
                <td>
                  <Button
                    size="sm"
                    className="me-1"
                    onClick={() => onEditExpense(expense)}
                  >
                    <i className="fas fa-edit"></i>
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => onDeleteExpense(expense)}
                  >
                    <i className="fas fa-trash"></i>
                  </Button>
                </td>
              </tr>
            );
          })}
      </tbody>
    </Table>
  );
};
