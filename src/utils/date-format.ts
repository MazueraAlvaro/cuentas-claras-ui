export const monthAbbreviationByMonthIndex = (index: number): string => {
  const months = [
    "Ene",
    "Feb",
    "Mar",
    "Abr",
    "May",
    "Jun",
    "Jul",
    "Ago",
    "Sep",
    "Oct",
    "Nov",
    "Dic",
  ];
  return months[index];
};

export const getDateFormatToApi = (date: Date, format: string = "YYYY-MM") => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");

  if (format === "YYYY-MM-DD") {
    return `${year}-${month}-${day}`;
  } else if (format === "YYYY-MM") {
    return `${year}-${month}`;
  }
  return "";
};

export const getDateFormatToDisplay = (
  date: Date,
  locale: string = "es-CO",
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  },
): string => {
  return date.toLocaleDateString(locale, options);
};
