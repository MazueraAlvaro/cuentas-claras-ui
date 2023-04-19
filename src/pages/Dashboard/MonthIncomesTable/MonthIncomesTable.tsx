import { Badge, Button, OverlayTrigger, Table, Tooltip } from "react-bootstrap";
import { MonthIncome } from "../../../interfaces/months.interface";
import { currencyFormat } from "../../../utils/currency-format";

interface MonthIncomeTableProps {
  monthIncomes: MonthIncome[];
  onEditMonthIncome: (monthIncome: MonthIncome) => void;
  onDeleteMonthIncome: (monthIncome: MonthIncome) => void;
  totalIncomes: number;
  currentBalance: number;
  difference: number;
  totalRows: number;
}

export const MonthIncomesTable: React.FC<MonthIncomeTableProps> = ({
  monthIncomes,
  onEditMonthIncome,
  onDeleteMonthIncome,
  totalIncomes,
  currentBalance,
  difference,
  totalRows,
}) => {
  return (
    <Table>
      <thead>
        <tr>
          <th colSpan={5} className="text-center">
            <h5>Ingresos</h5>
          </th>
        </tr>
        <tr>
          <th>No.</th>
          <th>Nombre</th>
          <th>Cantidad</th>
          <th>Recibido</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {monthIncomes &&
          monthIncomes.map((monthIncome, index) => {
            return (
              <tr key={monthIncome.id}>
                <td>{index + 1}</td>
                <td>
                  <OverlayTrigger
                    placement="right"
                    overlay={
                      <Tooltip>{monthIncome.income.description}</Tooltip>
                    }
                  >
                    <span>{monthIncome.income.name}</span>
                  </OverlayTrigger>
                </td>
                <td className="text-right">
                  {currencyFormat(monthIncome.amount)}
                </td>
                <td>
                  <Badge pill bg={monthIncome.received ? "success" : "danger"}>
                    {monthIncome.received ? "SI" : "NO"}
                  </Badge>
                </td>
                <td>
                  <Button
                    size="sm"
                    className="me-1"
                    onClick={() => onEditMonthIncome(monthIncome)}
                  >
                    <i className="fas fa-edit"></i>
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => onDeleteMonthIncome(monthIncome)}
                  >
                    <i className="fas fa-trash"></i>
                  </Button>
                </td>
              </tr>
            );
          })}
        {monthIncomes &&
          Array.from({ length: totalRows - monthIncomes.length }).map(
            (_, index) => (
              <tr>
                <td colSpan={5} height={48}></td>
              </tr>
            )
          )}
      </tbody>
      <tfoot>
        <tr>
          <th colSpan={2}>TOTAL</th>
          <td>{currencyFormat(totalIncomes)}</td>
        </tr>
        <tr>
          <th colSpan={2}>DIFERENCIA</th>
          <td>{currencyFormat(difference)}</td>
        </tr>
        <tr>
          <th colSpan={2}>SALDO</th>
          <td>{currencyFormat(currentBalance)}</td>
        </tr>
      </tfoot>
    </Table>
  );
};
