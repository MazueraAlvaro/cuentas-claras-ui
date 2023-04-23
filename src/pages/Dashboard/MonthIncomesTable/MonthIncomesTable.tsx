import {
  Badge,
  Button,
  Form,
  OverlayTrigger,
  Table,
  Tooltip,
} from "react-bootstrap";
import { MonthIncome } from "../../../interfaces/months.interface";
import { currencyFormat } from "../../../utils/currency-format";
import { ChangeEvent, useState } from "react";
import { MonthIncomeAddRow } from "../MonthIncomeAddRow";
import { Income } from "../../../interfaces/incomes.interface";

export interface onUpdateIncomeProps {
  monthIncome: MonthIncome;
  amount: number;
  received: boolean;
}

interface MonthIncomeTableProps {
  monthIncomes: MonthIncome[];
  onUpdateMonthIncome: (data: onUpdateIncomeProps) => void;
  onDeleteMonthIncome: (monthIncome: MonthIncome) => void;
  onAddMonthIncome: (monthIncome: Income) => void;
  totalIncomes: number;
  currentBalance: number;
  difference: number;
  totalRows: number;
}

export const MonthIncomesTable: React.FC<MonthIncomeTableProps> = ({
  monthIncomes,
  onUpdateMonthIncome,
  onDeleteMonthIncome,
  onAddMonthIncome,
  totalIncomes,
  currentBalance,
  difference,
  totalRows,
}) => {
  const [editMonthIncome, setEditMonthIncome] = useState<MonthIncome>();
  const [editAmountInput, setEditAmountInput] = useState<number>(0);
  const [editReceivedInput, setEditReceivedInput] = useState<boolean>(false);
  const handleEditMonthIncome = (monthIncome: MonthIncome) => {
    setEditMonthIncome(monthIncome);
    setEditAmountInput(monthIncome.amount);
    setEditReceivedInput(monthIncome.received);
  };
  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEditAmountInput(parseInt(e.target.value));
  };
  const handleReceivedInput = (e: ChangeEvent<HTMLInputElement>) => {
    setEditReceivedInput(e.target.checked);
  };
  const handleSaveEditMonthIncome = () => {
    if (editMonthIncome) {
      onUpdateMonthIncome({
        monthIncome: editMonthIncome,
        amount: editAmountInput,
        received: editReceivedInput,
      });
    }
    setEditMonthIncome(undefined);
  };
  const handleCancelEditMonthIncome = () => {
    setEditMonthIncome(undefined);
  };
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
                    placement="top"
                    overlay={
                      <Tooltip>{monthIncome.income.description}</Tooltip>
                    }
                  >
                    <span>{monthIncome.income.name}</span>
                  </OverlayTrigger>
                </td>
                <td className="text-right">
                  {editMonthIncome && editMonthIncome.id === monthIncome.id ? (
                    <Form.Control
                      type="number"
                      value={editAmountInput}
                      onChange={handleAmountChange}
                    />
                  ) : (
                    currencyFormat(monthIncome.amount)
                  )}
                </td>
                <td>
                  {editMonthIncome && editMonthIncome.id === monthIncome.id ? (
                    <Form.Check // prettier-ignore
                      type="switch"
                      className="mt-2"
                      checked={editReceivedInput}
                      onChange={handleReceivedInput}
                    />
                  ) : (
                    <Badge
                      pill
                      bg={monthIncome.received ? "success" : "danger"}
                    >
                      {monthIncome.received ? "SI" : "NO"}
                    </Badge>
                  )}
                </td>
                <td>
                  {editMonthIncome && editMonthIncome.id === monthIncome.id ? (
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
                      onClick={() => handleEditMonthIncome(monthIncome)}
                    >
                      <i className="fas fa-edit"></i>
                    </Button>
                  )}
                  {editMonthIncome && editMonthIncome.id === monthIncome.id ? (
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
                      onClick={() => onDeleteMonthIncome(monthIncome)}
                    >
                      <i className="fas fa-trash"></i>
                    </Button>
                  )}
                </td>
              </tr>
            );
          })}
        {monthIncomes && (
          <MonthIncomeAddRow
            monthIncomes={monthIncomes}
            onAddMonthIncome={onAddMonthIncome}
          />
        )}
        {monthIncomes &&
          Array.from({ length: totalRows - monthIncomes.length }).map(
            (_, index) => (
              <tr key={index}>
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
