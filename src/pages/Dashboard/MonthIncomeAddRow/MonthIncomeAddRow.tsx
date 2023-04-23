import { ChangeEvent, useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { MonthIncome } from "../../../interfaces/months.interface";
import { currencyFormat } from "../../../utils/currency-format";
import { useIncomesStore } from "../../../stores/incomes.store";
import { Income } from "../../../interfaces/incomes.interface";

interface MonthIncomeAddRowProps {
  monthIncomes: MonthIncome[];
  onAddMonthIncome: (monthIncome: Income) => void;
}

export const MonthIncomeAddRow: React.FC<MonthIncomeAddRowProps> = ({
  monthIncomes,
  onAddMonthIncome,
}) => {
  //Stores
  const loadIncomes = useIncomesStore((state) => state.loadIncomes);
  const incomes = useIncomesStore((state) => state.incomes);

  const [showAddMonthIncome, setShowAddMonthIncome] = useState(false);
  const [selectedIncome, setSelectedIncome] = useState<Income>();
  const [filteredIncomes, setFilteredIncomes] = useState<Income[]>();

  useEffect(() => {
    if (incomes) {
      const filteredOptions = incomes.filter(
        (income: Income) =>
          !monthIncomes.some(
            (monthIncome) => monthIncome.income.id === income.id
          )
      );
      setFilteredIncomes(filteredOptions);
      setSelectedIncome(filteredOptions[0]);
    }
  }, [incomes, monthIncomes]);

  //Helpers
  const buildIncomesOptions = () => {
    return (
      <>
        {filteredIncomes &&
          filteredIncomes.map((income) => (
            <option key={income.id} value={income.id}>
              {income.name}
            </option>
          ))}
      </>
    );
  };

  const handleAddMonthIncome = () => {
    if (incomes.length === 0) loadIncomes();
    setShowAddMonthIncome(true);
  };
  const handleConfirmAddMonthIncome = () => {
    if (selectedIncome) onAddMonthIncome(selectedIncome);
    setShowAddMonthIncome(false);
  };
  const handleCancelAddMonthIncome = () => {
    setShowAddMonthIncome(false);
  };
  const handleChangeIncome = (e: ChangeEvent<HTMLSelectElement>) => {
    const income = incomes.find(
      (income) => parseInt(e.target.value) === income.id
    );
    setSelectedIncome(income);
  };

  return (
    <tr>
      <td>{showAddMonthIncome && monthIncomes.length + 1}</td>
      <td>
        {showAddMonthIncome && (
          <Form.Select value={selectedIncome?.id} onChange={handleChangeIncome}>
            {buildIncomesOptions()}
          </Form.Select>
        )}
      </td>
      <td>
        {showAddMonthIncome &&
          selectedIncome &&
          currencyFormat(selectedIncome.amount)}
      </td>
      <td></td>
      <td>
        {!showAddMonthIncome ? (
          <Button
            size="sm"
            className="me-1"
            variant="success"
            as="span"
            onClick={handleAddMonthIncome}
          >
            <i className="fas fa-plus"></i>
          </Button>
        ) : (
          <>
            <Button
              size="sm"
              className="me-1"
              variant="success"
              onClick={handleConfirmAddMonthIncome}
            >
              <i className="fas fa-check"></i>
            </Button>
            <Button
              size="sm"
              className="me-1"
              variant="danger"
              onClick={handleCancelAddMonthIncome}
            >
              <i className="fas fa-xmark"></i>
            </Button>
          </>
        )}
      </td>
    </tr>
  );
};
