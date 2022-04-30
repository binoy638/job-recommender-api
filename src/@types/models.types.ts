export interface Address {
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface Organisation {
  name: string;
  description: string;
  yearFounded: number;
  website: string;
  logo: string;
  address: Address;
}

export interface Employer {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  organisation: Organisation;
}

export interface JobSeeker {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  address: Address;
  // TODO: convert to objects
  education: string;
  experience: string;
  skills: string;
  jobPreferences: string;
  jobHistory: string;
  resume: string;
}
