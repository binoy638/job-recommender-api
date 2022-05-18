export interface IAdmin {
  username: string;
  email: string;
  password: string;
}

export interface IAddress {
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface IUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
}

export interface IOrganisation {
  name: string;
  description: string;
  yearFounded: number;
  website: string;
  logo: string;
  address: IAddress;
}

export interface IEmployer extends IUser {
  employerId: number;
  organisation: IOrganisation;
  verified: boolean;
}

export interface IEducation {
  degree: string;
  institute: string;
  startYear: number;
  endYear: number;
  percentage: number;
}

export interface IJob {
  title: string;
  company: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface IJobSeeker extends IUser {
  address: IAddress;
  education: IEducation[];
  // TODO: convert to objects
  experience: string;
  skills: string;
  jobPreferences: string;
  jobHistory: string;
  resume: string;
}
