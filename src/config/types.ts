export type User = {
  id: number;
  diaplayName: string;
  username: string;
  dob: Date;
  email: string | null;
  mobile: string | null;
};

export type DateField = 'day' | 'month' | 'year';
