import {
  FloatingLabel,
  Form,
  InputGroup,
  OverlayTrigger,
  Popover,
} from "react-bootstrap";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { monthAbbreviationByMonthIndex } from "../../utils/date-format";
import { useState } from "react";

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

interface MonthPickerProps {
  onChange: (value: Date) => void;
  label: string;
  initialValue?: Date;
  maxDetail?: "month" | "year" | "decade" | "century";
}

export const MonthPicker: React.FC<MonthPickerProps> = ({
  onChange,
  label,
  initialValue = new Date(),
  maxDetail = "year",
}) => {
  const [value, setValue] = useState<Value>(initialValue);

  const getSelectedDate = (): string => {
    const month = (value as Date).getMonth();
    const year = (value as Date).getFullYear();
    const day = (value as Date).getDate();

    if (maxDetail === "year")
      return monthAbbreviationByMonthIndex(month) + ". " + year;
    if (maxDetail === "month")
      return day + " " + monthAbbreviationByMonthIndex(month) + ". " + year;
    return year.toString();
  };

  const handleChange = (value: Value) => {
    setValue(value);
    onChange(value as Date);
  };

  const overlay = () => {
    return (
      <Popover id="popover-basic">
        <Popover.Body>
          <Calendar
            locale="es-ES"
            onChange={handleChange}
            onClickMonth={(value) => false}
            maxDetail={maxDetail}
            formatMonth={(locale, date) =>
              monthAbbreviationByMonthIndex(date.getMonth())
            }
            value={value}
          />
        </Popover.Body>
      </Popover>
    );
  };
  return (
    <OverlayTrigger
      rootClose
      trigger="click"
      placement="bottom"
      overlay={overlay()}
    >
      <InputGroup>
        <FloatingLabel label={label}>
          <Form.Control
            placeholder="Desde"
            readOnly
            value={getSelectedDate()}
          />
        </FloatingLabel>
        <InputGroup.Text>
          <i className="fas fa-calendar me-1"></i>
        </InputGroup.Text>
      </InputGroup>
    </OverlayTrigger>
  );
};
