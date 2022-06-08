import * as Yup from 'yup';

const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\(\d{2,3}\\)[ \\-]*)|(\d{2,4})[ \\-]*)*?\d{3,4}?[ \\-]*\d{3,4}?$/;

export const employerValidator = Yup.object().shape({
  firstName: Yup.string().max(30).min(3).required(),
  lastName: Yup.string().max(30).min(3).required(),
  email: Yup.string().email().required(),
  password: Yup.string().min(6).required(),
  phone: Yup.string().matches(phoneRegExp, 'Phone number is not valid').min(10).max(10),
  company: Yup.object().shape({
    name: Yup.string().min(3).required(),
    description: Yup.string().max(500).required(),
    yearFounded: Yup.number().required(),
    website: Yup.string().url().required(),
    logo: Yup.string().required(),
    address: Yup.object()
      .shape({
        city: Yup.string().required(),
        state: Yup.string().required(),
        country: Yup.string().required(),
      })
      .required(),
  }),
});
