/* eslint-disable @typescript-eslint/no-explicit-any */
import * as Yup from 'yup';

export interface AdminAttrs {
  username: string;
  email: string;
  password: string;
}

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
}

export enum UserType {
  EMPLOYER = 'employer',
  JOBSEEKER = 'jobseeker',
  ADMIN = 'admin',
}

export interface Address {
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface SkillAttrs {
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced';
}

export interface RequestPayload {
  body: Yup.ObjectSchema<any> | undefined;
  query: Yup.ObjectSchema<any> | undefined;
  params: Yup.ObjectSchema<any> | undefined;
}

export enum RequestResponse {
  INVALID_PAYLOAD = 'Invalid request payload',
  SERVER_ERROR = 'Internal server error',
}
