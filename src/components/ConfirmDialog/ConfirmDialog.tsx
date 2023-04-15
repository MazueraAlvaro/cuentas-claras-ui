import { Button, Modal } from "react-bootstrap";

interface ConfirmDialogProps {
  show: boolean;
  text: string;
  setShow: (value: boolean) => void;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  text,
  show,
  setShow,
  onConfirm,
  onCancel,
}) => {
  const handleClose = () => setShow(false);
  const handleConfirm = () => {
    if (onConfirm) onConfirm();
    setShow(false);
  };
  const handleCancel = () => {
    if (onCancel) onCancel();
    setShow(false);
  };
  return (
    <Modal
      show={show}
      onHide={handleClose}
      keyboard={false}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Confirmar acción</Modal.Title>
      </Modal.Header>
      <Modal.Body>{text}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCancel}>
          Cancelar
        </Button>
        <Button
          form="expense-form"
          type="submit"
          variant="primary"
          onClick={handleConfirm}
        >
          Aceptar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
