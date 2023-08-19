import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { Button, Table } from "react-bootstrap";
import { env } from "../../../config/env";
import { currencyFormat } from "../../../utils/currency-format";
import { ExpenseAccumulated } from "../../../interfaces/accumulated.interface";
import { Expense } from "../../../interfaces/expenses.interface";

export interface AccumulatedTableProps {
  onViewExpenseAccumulated: (expense: Partial<Expense>) => void;
}

export const AccumulatedTable: React.FC<AccumulatedTableProps> = ({
  onViewExpenseAccumulated,
}) => {
  const [data, setData] = useState<ExpenseAccumulated[]>();
  const [months, setMonths] =
    useState<Array<{ index: number; name: string }>>();
  const toDate = useMemo(() => new Date(), []);
  const fromDate = useMemo(() => {
    const date = new Date();
    date.setMonth(toDate.getMonth() - 5);
    return date;
  }, [toDate]);

  useEffect(() => {
    (async () => {
      const { data } = await axios.get(
        `${env?.REACT_APP_API_URL}/api/accumulated`,
        { params: { from: fromDate, to: toDate } }
      );
      setData(data.data);
      setMonths(data.months);
    })();
  }, [toDate, fromDate]);

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>#</th>
          <th>Nombre</th>
          {months &&
            months.map((month) => <th key={month.index}>{month.name}</th>)}
          <th>Total</th>
          <th>Opc</th>
        </tr>
      </thead>
      <tbody>
        {data &&
          data.map((accumulated, index) => {
            return (
              <tr key={accumulated.expense.id}>
                <td>{index + 1}</td>
                <td>{accumulated.expense.name}</td>
                {months &&
                  months.map((month) => (
                    <td key={month.index}>
                      {currencyFormat(
                        accumulated.months.find(
                          (accMonth) =>
                            accMonth.paid && accMonth.month === month.index
                        )?.amount || 0
                      )}
                    </td>
                  ))}
                <td>
                  <b>{currencyFormat(accumulated.totalPaid)}</b>
                </td>
                <td>
                  <Button
                    size="sm"
                    className="me-1"
                    onClick={() =>
                      onViewExpenseAccumulated(accumulated.expense)
                    }
                  >
                    <i className="fas fa-eye"></i>
                  </Button>
                </td>
              </tr>
            );
          })}
      </tbody>
    </Table>
  );
};
