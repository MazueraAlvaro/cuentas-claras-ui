import { Badge, Button, OverlayTrigger, Table, Tooltip } from "react-bootstrap";
import { MonthExpense } from "../../../interfaces/months.interface";
import { currencyFormat } from "../../../utils/currency-format";

interface MonthExpenseTableProps {
  monthExpenses: MonthExpense[];
  onEditMonthExpense: (monthExpense: MonthExpense) => void;
  onDeleteMonthExpense: (monthExpense: MonthExpense) => void;
  totalExpenses: number;
  totalUnpaid: number;
}

export const MonthExpensesTable: React.FC<MonthExpenseTableProps> = ({
  monthExpenses,
  onEditMonthExpense,
  onDeleteMonthExpense,
  totalExpenses,
  totalUnpaid,
}) => {
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
                    placement="right"
                    overlay={
                      <Tooltip>{monthExpense.expense.description}</Tooltip>
                    }
                  >
                    <span>{monthExpense.expense.name}</span>
                  </OverlayTrigger>
                </td>
                <td className="text-right">
                  {currencyFormat(monthExpense.amount)}
                </td>
                <td>
                  <Badge pill bg={monthExpense.paid ? "success" : "danger"}>
                    {monthExpense.paid ? "SI" : "NO"}
                  </Badge>
                </td>
                <td>
                  <Button
                    size="sm"
                    className="me-1"
                    onClick={() => onEditMonthExpense(monthExpense)}
                  >
                    <i className="fas fa-edit"></i>
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => onDeleteMonthExpense(monthExpense)}
                  >
                    <i className="fas fa-trash"></i>
                  </Button>
                </td>
              </tr>
            );
          })}
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
