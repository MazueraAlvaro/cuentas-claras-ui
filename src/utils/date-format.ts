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

export const getDateFormatToApi = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;

  return `${year}-${month.toString().padStart(2, "0")}-00`;
};
