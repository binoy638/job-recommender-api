import { Address, User } from './index';

export interface Organisation {
  name: string;
  description: string;
  yearFounded: number;
  website: string;
  logo: string;
  address: Address;
}

export interface EmployerAttrs extends User {
  organisation: Organisation;
  isVerified: boolean;
  isBanned: boolean;
}
