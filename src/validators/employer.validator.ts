import * as Yup from 'yup';

import { RequestPayload } from '../@types';

export const employerRegisterValidator: RequestPayload = {
  body: Yup.object().shape({
    name: Yup.string().required(),
  }),
  query: undefined,
  params: undefined,
};
