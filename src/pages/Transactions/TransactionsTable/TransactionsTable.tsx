import { Button, Form, Table } from "react-bootstrap";
import {
  Transaction,
  TransactionCategory,
} from "../../../interfaces/transactions.interface";
import { currencyFormat } from "../../../utils/currency-format";
import { getDateFormatToDisplay } from "../../../utils/date-format";
import { useState } from "react";
import axios from "axios";
import { env } from "../../../config/env";

export interface TransactionsTableProps {
  transactions: Transaction[];
  categoryList: TransactionCategory[];
  onTransactionUpdate?: (transaction: Transaction) => void;
}
export const TransactionsTable: React.FC<TransactionsTableProps> = ({
  transactions,
  categoryList,
  onTransactionUpdate,
}: TransactionsTableProps) => {
  const [editableTransaction, setEditableTransaction] =
    useState<Transaction | null>(null);

  const handleEditableTransaction = (transaction: Transaction) => {
    if (!transaction.category) {
      transaction.category = categoryList[0];
    }
    setEditableTransaction(transaction);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editableTransaction) {
      setEditableTransaction({
        ...editableTransaction,
        amount: parseFloat(e.target.value),
      });
    }
  };

  const handleSaveTransactionEdit = async () => {
    if (!editableTransaction) return;
    await axios.put(
      `${env?.REACT_APP_API_URL}/api/transactions/${editableTransaction.id}`,
      {
        ...editableTransaction,
        amount: editableTransaction.amount,
        category: editableTransaction.category,
      },
    );
    if (onTransactionUpdate && editableTransaction) {
      onTransactionUpdate(editableTransaction);
    }
    setEditableTransaction(null);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!editableTransaction) return;
    setEditableTransaction({
      ...editableTransaction,
      category: categoryList.find(
        (category) => category.id === parseInt(e.target.value),
      ),
    });
  };

  const renderCategorySelect = () => {
    if (!editableTransaction) return null;
    return (
      <Form.Select
        value={editableTransaction.category?.id}
        onChange={(e) => handleCategoryChange(e)}
      >
        {categoryList.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </Form.Select>
    );
  };

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>#</th>
          <th>Fecha</th>
          <th>Comercio</th>
          <th>Monto</th>
          <th>Banco</th>
          <th>Categoria</th>
          <th>Opc</th>
        </tr>
      </thead>
      <tbody>
        {transactions &&
          transactions.map((transaction, index) => {
            return (
              <tr key={transaction.id}>
                <td>{index + 1}</td>
                <td>
                  {getDateFormatToDisplay(new Date(transaction.datetime))}
                </td>
                <td>{transaction.merchant}</td>
                <td>
                  {editableTransaction &&
                  editableTransaction.id === transaction.id ? (
                    <Form.Control
                      type="number"
                      value={editableTransaction.amount}
                      onChange={handleAmountChange}
                    />
                  ) : (
                    currencyFormat(transaction.amount)
                  )}
                </td>
                <td>{transaction.bank}</td>
                <td>
                  {editableTransaction &&
                  editableTransaction.id === transaction.id
                    ? renderCategorySelect()
                    : transaction.category?.name}
                </td>
                <td>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleEditableTransaction(transaction)}
                    className="me-1"
                    as="span"
                    hidden={editableTransaction?.id === transaction.id}
                  >
                    <i className="fas fa-edit"></i>
                  </Button>
                  <Button
                    variant="success"
                    size="sm"
                    className="me-1"
                    onClick={handleSaveTransactionEdit}
                    hidden={editableTransaction?.id !== transaction.id}
                  >
                    <i className="fas fa-check"></i>
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    className="me-1"
                    onClick={() => {
                      setEditableTransaction(null);
                    }}
                    hidden={editableTransaction?.id !== transaction.id}
                  >
                    <i className="fas fa-xmark"></i>
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="me-1"
                    onClick={() => {}}
                    hidden={editableTransaction?.id === transaction.id}
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
