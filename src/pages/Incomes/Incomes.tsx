import React, { useEffect, useState } from "react";
import { Alert, Button, Card } from "react-bootstrap";
import { Income } from "../../interfaces/incomes.interface";
import { useIncomesStore } from "../../stores/incomes.store";
import { IncomesTable } from "./IncomesTable";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import axios from "axios";
import { UpsertIncome } from "./UpsertIncome";

export const Incomes: React.FC = () => {
  const loadIncomes = useIncomesStore((state) => state.loadIncomes);
  const addIncome = useIncomesStore((state) => state.addIncome);
  const [upsertIncome, setUpsertIncome] = useState<Income | null>(null);
  const [showUpsert, setShowUpsert] = useState(false);
  const [alertData, setAlertData] = useState({
    variant: "",
    text: "",
    show: false,
  });
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmDialogText, setConfirmDialogText] = useState("");
  const [incomeToDelete, setIncomeToDelete] = useState<Income | null>(null);

  useEffect(() => {
    loadIncomes();
  }, [loadIncomes]);

  const handleSuccessCreate = (income: Income) => {
    if (upsertIncome) {
      loadIncomes();
    } else {
      addIncome(income);
    }
    setShowUpsert(false);
    setAlertData({
      variant: "success",
      text: `Ingreso ${upsertIncome ? "actualizado" : "creado"} exitosamente`,
      show: true,
    });
    setTimeout(() => setAlertData({ ...alertData, show: false }), 2500);
  };

  const handleOnEditIncome = (income: Income) => {
    setShowUpsert(true);
    setUpsertIncome(income);
  };

  const handleOnDeleteIncome = (income: Income) => {
    setConfirmDialogText(`Está seguro de eliminar el ingreso "${income.name}"`);
    setShowConfirmDialog(true);
    setIncomeToDelete(income);
  };

  const handleOnDialogConfirm = async () => {
    if (incomeToDelete) {
      await axios.delete(
        "http://localhost:3000/api/incomes/" + incomeToDelete.id
      );
      setShowConfirmDialog(false);
      setAlertData({
        variant: "success",
        text: `Ingreso ${incomeToDelete.name} eliminado exitosamente`,
        show: true,
      });
      setTimeout(() => setAlertData({ ...alertData, show: false }), 2500);
      loadIncomes();
    }
  };
  return (
    <>
      <h1 className="mt-4">Ingresos</h1>
      <ol className="breadcrumb mb-4">
        <li className="breadcrumb-item active">Ingresos</li>
      </ol>
      <Alert variant={alertData.variant} show={alertData.show}>
        {alertData.text}
      </Alert>
      <Card className="mb-4">
        <Card.Header className="d-flex justify-content-between">
          <Card.Title className="m-0">
            <i className="fas fa-table me-1"></i>
            Ingresos
          </Card.Title>
          <div>
            <Button
              variant="success"
              size="sm"
              onClick={() => setShowUpsert(true)}
            >
              <i className="fas fa-plus me-1"></i>
              Crear
            </Button>
          </div>
        </Card.Header>
        <Card.Body>
          <IncomesTable
            onEditIncome={handleOnEditIncome}
            onDeleteIncome={handleOnDeleteIncome}
          />
        </Card.Body>
      </Card>
      <UpsertIncome
        show={showUpsert}
        setShow={setShowUpsert}
        onSuccess={handleSuccessCreate}
        income={upsertIncome}
      />
      <ConfirmDialog
        show={showConfirmDialog}
        setShow={setShowConfirmDialog}
        onConfirm={handleOnDialogConfirm}
        text={confirmDialogText}
      />
    </>
  );
};
