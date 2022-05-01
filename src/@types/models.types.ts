export interface Address {
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
}

export interface Organisation {
  name: string;
  description: string;
  yearFounded: number;
  website: string;
  logo: string;
  address: Address;
}

export interface Employer extends User {
  organisation: Organisation;
}

export interface Education {
  degree: string;
  institute: string;
  startYear: number;
  endYear: number;
  percentage: number;
}

export interface JobSeeker extends User {
  address: Address;
  education: Education[];
  // TODO: convert to objects
  experience: string;
  skills: string;
  jobPreferences: string;
  jobHistory: string;
  resume: string;
}
