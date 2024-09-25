export type User = {
  id: number;
  firstName: string;
  lastName: string;
  userName: string;
  email: string | null;
  mobile: string | null;
};

export type DateField = 'day' | 'month' | 'year';
