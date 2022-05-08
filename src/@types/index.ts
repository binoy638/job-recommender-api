/* eslint-disable @typescript-eslint/no-explicit-any */
import * as Yup from 'yup';

export interface RequestPayload {
  body: Yup.ObjectSchema<any> | undefined;
  query: Yup.ObjectSchema<any> | undefined;
  params: Yup.ObjectSchema<any> | undefined;
}
