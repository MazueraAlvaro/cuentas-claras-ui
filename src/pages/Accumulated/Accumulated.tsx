import { Card } from "react-bootstrap";
import { AccumulatedTable } from "./AccumulatedTable";

export const Accumulated: React.FC = () => {
  return (
    <>
      <h1 className="mt-4">Acumulados</h1>
      <ol className="breadcrumb mb-4">
        <li className="breadcrumb-item active">Acumulados</li>
      </ol>
      <Card className="mb-4">
        <Card.Header className="d-flex justify-content-between">
          <Card.Title className="m-0">
            <i className="fas fa-table me-1"></i>
            Acumulados
          </Card.Title>
        </Card.Header>
        <Card.Body>
          <AccumulatedTable />
        </Card.Body>
      </Card>
    </>
  );
};
