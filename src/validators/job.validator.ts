import * as Yup from 'yup';

export const jobValidator = Yup.object().shape({
  jobTitle: Yup.string().max(30).min(3).required(),
  employer: Yup.string().required(),
  description: Yup.string().max(2000).required(),
  requiredSkills: Yup.array().of(Yup.string()),
  numberOfOpenings: Yup.number().required(),
  category: Yup.string().required(),
  ctc: Yup.number(),
  applyBy: Yup.date().required(),
  startDate: Yup.date(),
});
