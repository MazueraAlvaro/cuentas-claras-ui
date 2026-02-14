import { Button, Card, Col, Row, Table } from "react-bootstrap";
import { useEffect, useState } from "react";
import axios from "axios";
import { env } from "../../config/env";
import { CreditCard } from "../../interfaces/creditCard.interface";
import { TransactionsTable } from "./TransactionsTable/TransactionsTable";
import { MonthPicker } from "../../components/MonthPicker";
import { getDateFormatToApi } from "../../utils/date-format";
import { currencyFormat } from "../../utils/currency-format";
import {
  Transaction,
  TransactionCategory,
} from "../../interfaces/transactions.interface";
import { TransactionForm, TransactionInitialValues } from "./TransactionForm";

export const Transactions: React.FC = () => {
  const [selectedCard, setSelectedCard] = useState<CreditCard | null>(null);
  const [creditCards, setCreditCards] = useState<CreditCard[]>([]);
  const [categorySummaries, setCategorySummaries] = useState<any[]>([]);
  const [showTransactionForm, setShowTransactionForm] =
    useState<boolean>(false);

  const [categoryList, setCategoryList] = useState<TransactionCategory[]>([]);

  useEffect(() => {
    axios
      .get(`${env?.REACT_APP_API_URL}/api/transactions/transaction-categories`)
      .then((response) => {
        setCategoryList(response.data);
      });
  }, []);

  const getFranchiseIcon = (franchise: string) => {
    const commonClass = "fas fa-3x float-end";
    switch (franchise.toLowerCase()) {
      case "visa":
        return (
          <i
            className={`${commonClass} fa-brands fa-cc-visa`}
            style={{ color: "#15549C" }}
          ></i>
        );
      case "mastercard":
        return (
          <i
            className={`${commonClass} fa-brands fa-cc-mastercard`}
            style={{ color: "#EC2627" }}
          ></i>
        );
      case "amex":
        return (
          <i
            className={`${commonClass} fa-brands fa-cc-amex`}
            style={{ color: "#1F6CCE" }}
          ></i>
        );
      case "discover":
        return <i className={`${commonClass} fa-brands fa-cc-discover`}></i>;
      default:
        return <i className={`${commonClass} fa-credit-card`}></i>;
    }
  };

  function getDateRange(baseDate = new Date()) {
    const y = baseDate.getFullYear();
    const m = baseDate.getMonth();
    const d = baseDate.getDate();

    const startMonthOffset = d <= 15 ? -1 : 0;
    const endMonthOffset = d <= 15 ? 0 : 1;

    const startDate = new Date(y, m + startMonthOffset, 15, 0, 0, 0, 0);
    const endDate = new Date(y, m + endMonthOffset, 15, 0, 0, 0, 0);

    return { startDate, endDate };
  }

  const [fromDate, setFrom] = useState<Date>(getDateRange().startDate);
  const [toDate, setTo] = useState<Date>(getDateRange().endDate);

  const creditCardNumRows = Math.ceil(creditCards.length / 2);

  const handleChange =
    (func: React.Dispatch<React.SetStateAction<Date>>) => (date: Date) =>
      func(date);

  const retrieveTransactions = async (fromDate: Date, toDate: Date) => {
    const { data } = await axios.get(
      `${env?.REACT_APP_API_URL}/api/transactions/by-cards`,
      {
        params: {
          from: getDateFormatToApi(fromDate, "YYYY-MM-DD"),
          to: getDateFormatToApi(toDate, "YYYY-MM-DD"),
        },
      },
    );
    setCreditCards(data);
  };

  useEffect(() => {
    if (selectedCard) {
      const updatedSelectedCard = creditCards.find(
        (card: CreditCard) => card.id === selectedCard.id,
      );
      setSelectedCard(updatedSelectedCard || null);
    } else if (creditCards.length > 0) {
      setSelectedCard(creditCards[0]);
    }
  }, [creditCards, selectedCard]);

  useEffect(() => {
    retrieveTransactions(fromDate, toDate);
    retrieveCategorySummaries(fromDate, toDate);
  }, [fromDate, toDate]);

  const retrieveCategorySummaries = async (fromDate: Date, toDate: Date) => {
    const { data } = await axios.get(
      `${env?.REACT_APP_API_URL}/api/transactions/category-summary`,
      {
        params: {
          from: getDateFormatToApi(fromDate, "YYYY-MM-DD"),
          to: getDateFormatToApi(toDate, "YYYY-MM-DD"),
        },
      },
    );
    setCategorySummaries(data);
  };

  const handleSetSelectedCard = (card: CreditCard) => {
    setSelectedCard(card);
  };

  const handleTransactionUpdate = (updatedTransaction: Transaction) => {
    retrieveTransactions(fromDate, toDate);
  };

  const handleSaveTransaction = async (
    transaction: TransactionInitialValues,
  ) => {
    console.log("Saving transaction", transaction);
    const newTransaction = {
      ...transaction,
      category: parseInt(transaction.category),
      bank: selectedCard?.bank || "",
      cardLastDigits: selectedCard?.lastDigits || "",
      type: "compra",
      creditCardId: selectedCard?.id || 0,
    };
    await axios.post(
      `${env?.REACT_APP_API_URL}/api/transactions/create`,
      newTransaction,
    );
    retrieveTransactions(fromDate, toDate);
    setShowTransactionForm(false);
    return true;
  };

  return (
    <>
      <div className="d-flex justify-content-between">
        <h1 className="mt-4">Transacciones</h1>
        <div className="mt-4 d-flex justify-content-between gap-3">
          <MonthPicker
            initialValue={getDateRange().startDate}
            onChange={handleChange(setFrom)}
            label="Desde"
            maxDetail="month"
          />
          <MonthPicker
            initialValue={getDateRange().endDate}
            onChange={handleChange(setTo)}
            label="Hasta"
            maxDetail="month"
          />
        </div>
      </div>
      <ol className="breadcrumb mb-4">
        <li className="breadcrumb-item active">Transacciones</li>
      </ol>
      <Row
        style={{
          maxHeight: creditCardNumRows * 170 + creditCardNumRows * 15 + "px",
        }}
      >
        <Col md={6}>
          <Row>
            {creditCards.map((card) => (
              <Col md={6} key={card.id}>
                <Card
                  className="mb-3"
                  border={card.id === selectedCard?.id ? "primary" : "none"}
                >
                  <Card.Body>
                    <span className="fs-5 fw-bold">
                      {card.name} *{card.lastDigits}
                    </span>
                    {getFranchiseIcon(card.franchise)}
                    <span className="d-block mt-2">{card.bank}</span>
                    <div>
                      <span className="fs-4 fw-bold float-end">
                        {currencyFormat(card.totalAmount)}
                      </span>
                    </div>
                  </Card.Body>
                  <Card.Footer
                    onClick={() => {
                      handleSetSelectedCard(card);
                    }}
                    className="d-flex align-items-center justify-content-between"
                    style={{ cursor: "pointer" }}
                  >
                    <span className="small text-decoration-none text-secondary">
                      Seleccionar
                    </span>
                    <div className="small">
                      <i className="fas fa-angle-right"></i>
                    </div>
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
        <Col md={6}>
          <Card className="">
            <Card.Body
              className="overflow-auto mb-0 pb-0 mt-0 pt-0"
              style={{
                maxHeight:
                  creditCards.length > 0
                    ? creditCardNumRows * 170 +
                      (creditCardNumRows - 1) * 16 +
                      "px"
                    : "0px",
              }}
            >
              <Table size="sm" hover responsive className="mb-0 mt-0">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Monto</th>
                    <th>Porcentaje</th>
                  </tr>
                </thead>
                <tbody>
                  {categorySummaries.map((summary) => (
                    <tr key={summary.category}>
                      <td>{summary.category}</td>
                      <td>{currencyFormat(summary.totalAmount)}</td>
                      <td>{Math.floor(summary.percentageOfMax)}%</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Card className="mb-4">
        <Card.Header className="d-flex justify-content-between">
          <Card.Title className="m-0">
            <i className="fas fa-table me-1"></i>
            Transacciones
          </Card.Title>
          <div>
            <Button
              variant="success"
              size="sm"
              onClick={() => setShowTransactionForm(true)}
            >
              <i className="fas fa-plus me-1"></i>
              Crear
            </Button>
          </div>
        </Card.Header>
        <Card.Body>
          <TransactionsTable
            transactions={selectedCard?.transactions || []}
            onTransactionUpdate={handleTransactionUpdate}
            categoryList={categoryList}
          />
        </Card.Body>
      </Card>
      {showTransactionForm && (
        <TransactionForm
          show={showTransactionForm}
          transaction={null}
          transactionCategoryOptions={categoryList}
          onClose={() => setShowTransactionForm(false)}
          onSave={handleSaveTransaction}
          creditCardLastDigits={selectedCard?.lastDigits || ""}
        />
      )}
    </>
  );
};
