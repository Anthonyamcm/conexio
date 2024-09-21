export interface IRegistrationData {
  name: string;
  username: string;
  dob: Date;
  mobile?: string;
  email?: string;
  password: string;
}

export interface ICountryCode {
  code: string;
  flag: string;
  country: string;
}
