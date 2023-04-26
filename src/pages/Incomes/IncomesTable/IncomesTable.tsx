import { Badge, Button, OverlayTrigger, Table, Tooltip } from "react-bootstrap";
import { useIncomesStore } from "../../../stores/incomes.store";
import { Income } from "../../../interfaces/incomes.interface";
import { currencyFormat } from "../../../utils/currency-format";

interface IncomesTableProps {
  onEditIncome: (income: Income) => void;
  onDeleteIncome: (income: Income) => void;
}

export const IncomesTable: React.FC<IncomesTableProps> = ({
  onEditIncome,
  onDeleteIncome,
}) => {
  const Incomes = useIncomesStore((state) => state.incomes);

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>#</th>
          <th>Nombre</th>
          <th>Monto</th>
          <th>Recurrente</th>
          <th>Desde</th>
          <th>Hasta</th>
          <th>Tipo</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {Incomes &&
          Incomes.map((income, index) => {
            return (
              <tr key={income.id}>
                <td>{index + 1}</td>
                <td>
                  <OverlayTrigger
                    placement="right"
                    overlay={<Tooltip>{income.description}</Tooltip>}
                  >
                    <span>{income.name}</span>
                  </OverlayTrigger>
                </td>
                <td>{currencyFormat(income.amount)}</td>
                <td>
                  <Badge pill bg="success">
                    {income.isRecurring ? "SI" : "NO"}
                  </Badge>
                </td>
                <td>
                  {income.startAt
                    ? new Date(income.startAt).toLocaleDateString()
                    : "No definido"}
                </td>
                <td>
                  {income.endAt
                    ? new Date(income.endAt).toLocaleDateString()
                    : "No definido"}
                </td>
                <td>{income.incomeType.name}</td>
                <td>
                  <Button
                    size="sm"
                    className="me-1"
                    onClick={() => onEditIncome(income)}
                  >
                    <i className="fas fa-edit"></i>
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => onDeleteIncome(income)}
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
