export const isLeapYear = (year: string): boolean => {
  const formattedYear = parseInt(year, 10);
  return (
    formattedYear % 4 === 0 &&
    (formattedYear % 100 !== 0 || formattedYear % 400 === 0)
  );
};

// Function to get the number of days in a given month and year
export const getDaysInMonth = (month: string, year: string): number => {
  const formattedMonth = parseInt(month, 10);
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
  return daysInMonth[formattedMonth];
};

// Validation functions
export const isValidDay = (
  day: string,
  month: string,
  year: string,
): boolean => {
  const dayNum = parseInt(day, 10);
  return dayNum >= 1 && dayNum <= getDaysInMonth(month, year);
};

export const isValidMonth = (month: string): boolean => {
  const monthNum = parseInt(month, 10);
  return monthNum >= 1 && monthNum <= 12;
};

export const isValidYear = (year: string | number): boolean => {
  const currentYear = new Date().getFullYear();

  // Convert year to a number if it's a string
  const yearNumber = typeof year === 'string' ? parseInt(year, 10) : year;

  // Check if the year is a valid number and within the range
  if (!isNaN(yearNumber) && yearNumber >= 1900 && yearNumber <= currentYear) {
    return true;
  }

  return false;
};

export const convertToDate = (
  day: string,
  month: string,
  year: string,
): Date | null => {
  const numericDay = parseInt(day, 10);
  const numericMonth = parseInt(month, 10) - 1; // JS months are zero-indexed
  const numericYear = parseInt(year, 10);

  if (isNaN(numericDay) || isNaN(numericMonth) || isNaN(numericYear))
    return null;

  const date = new Date(numericYear, numericMonth, numericDay);

  // Ensure the date is valid by checking if it matches the given inputs
  if (
    date.getFullYear() === numericYear &&
    date.getMonth() === numericMonth &&
    date.getDate() === numericDay
  ) {
    return date;
  }
  return null;
};
