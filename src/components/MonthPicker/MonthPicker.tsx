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
}

export const MonthPicker: React.FC<MonthPickerProps> = ({
  onChange,
  label,
  initialValue = new Date(),
}) => {
  const [value, setValue] = useState<Value>(initialValue);

  const getSelectedMonth = () => {
    const month = (value as Date).getMonth();
    const year = (value as Date).getFullYear();

    return monthAbbreviationByMonthIndex(month) + ". " + year;
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
            view="year"
            onChange={handleChange}
            onClickMonth={(value) => false}
            maxDetail="year"
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
            value={getSelectedMonth()}
          />
        </FloatingLabel>
        <InputGroup.Text>
          <i className="fas fa-calendar me-1"></i>
        </InputGroup.Text>
      </InputGroup>
    </OverlayTrigger>
  );
};
