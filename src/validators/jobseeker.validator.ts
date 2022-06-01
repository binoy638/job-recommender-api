import * as Yup from 'yup';

const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\(\d{2,3}\\)[ \\-]*)|(\d{2,4})[ \\-]*)*?\d{3,4}?[ \\-]*\d{3,4}?$/;

export const jobseekerValidator = Yup.object().shape({
  firstName: Yup.string().max(30).min(3).required(),
  lastName: Yup.string().max(30).min(3).required(),
  email: Yup.string().email().required(),
  password: Yup.string().min(6).required(),
  phone: Yup.string().matches(phoneRegExp, 'Phone number is not valid').min(10).max(10),
  jobSeederId: Yup.number().max(12).min(12).required(),
  address: Yup.object().shape({
    city: Yup.string().required(),
    state: Yup.string().required(),
    zip: Yup.number().required(),
    country: Yup.string().required(),
  }),
  skills: Yup.array().of(Yup.string()),
  jobPreferences: Yup.array().of(Yup.string()).required(),
  about: Yup.string().required(),
  education: Yup.array().of(
    Yup.object().shape({
      degree: Yup.string().required(),
      institute: Yup.string().required(),
      startYear: Yup.number().required(),
      endYear: Yup.number().required(),
      percentage: Yup.number().required(),
    })
  ),
  experience: Yup.array().of(
    Yup.object().shape({
      role: Yup.string().required(),
      company: Yup.string().required(),
      startYear: Yup.number().required(),
      endYear: Yup.number().required(),
      description: Yup.string().required(),
    })
  ),
  resume: Yup.string(),
});
