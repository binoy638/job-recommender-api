/* eslint-disable @typescript-eslint/no-explicit-any */
import * as Yup from 'yup';

export enum UserType {
  EMPLOYER = 'employer',
  JOBSEEKER = 'jobseeker',
  ADMIN = 'admin',
}

export interface RequestPayload {
  body?: Yup.ObjectSchema<any> | undefined;
  query?: Yup.ObjectSchema<any> | undefined;
  params?: Yup.ObjectSchema<any> | undefined;
}

export enum RequestResponse {
  INVALID_PAYLOAD = 'Invalid request payload',
  SERVER_ERROR = 'Internal server error',
}
