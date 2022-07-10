/* eslint-disable @typescript-eslint/no-explicit-any */
import { ZodObject } from 'zod';

export enum UserType {
  EMPLOYER = 'employer',
  JOBSEEKER = 'jobseeker',
  ADMIN = 'admin',
}

export interface RequestPayload {
  body?: ZodObject<any>;
  query?: ZodObject<any>;
  params?: ZodObject<any>;
}

export enum RequestResponse {
  INVALID_PAYLOAD = 'Invalid request payload',
  SERVER_ERROR = 'Internal server error',
}

export enum Pagination {
  JOB_PAGE_SIZE = 12,
}

export enum JobSearchType {
  SKILL = 'skill',
  LOCATION = 'location',
  CATEGORY = 'category',
  JOB_TITLE = 'jobTitle',
  COMPANY = 'company',
}
