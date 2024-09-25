export const isLeapYear = (year: number): boolean =>
  year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);

// Function to get the number of days in a given month and year
export const getDaysInMonth = (month: number, year: number): number => {
  const daysInMonth = [
    0,
    31,
    isLeapYear(year) ? 29 : 28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
  ];
  return daysInMonth[month];
};

// Validation functions
export const isValidDay = (
  day: string,
  month: number,
  year: number,
): boolean => {
  const dayNum = parseInt(day, 10);
  return dayNum >= 1 && dayNum <= getDaysInMonth(month, year);
};

export const isValidMonth = (month: string): boolean => {
  const monthNum = parseInt(month, 10);
  return monthNum >= 1 && monthNum <= 12;
};
