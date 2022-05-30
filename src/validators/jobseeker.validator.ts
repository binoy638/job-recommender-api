import * as Yup from 'yup';

const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\(\d{2,3}\\)[ \\-]*)|(\d{2,4})[ \\-]*)*?\d{3,4}?[ \\-]*\d{3,4}?$/;

export const jobseekerValidator = Yup.object().shape({
  firstName: Yup.string().max(30).min(3).required(),
  lastName: Yup.string().max(30).min(3).required(),
  email: Yup.string().email().required(),
  password: Yup.string().min(6).required(),
  phone: Yup.string().matches(phoneRegExp, 'Phone number is not valid').min(10).max(10),
});
