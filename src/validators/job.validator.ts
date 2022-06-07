import * as Yup from 'yup';

export const jobAddValidator = {
  body: Yup.object().shape({
    jobTitle: Yup.string().max(30).min(3).required(),
    description: Yup.string().max(2000).required(),
    requiredSkills: Yup.array().of(Yup.string()),
    numberOfOpenings: Yup.number().required(),
    category: Yup.string().required(),
    ctc: Yup.number(),
    applyBy: Yup.date().required(),
    startDate: Yup.date(),
  }),
};

export const jobUpdateValidator = {
  body: Yup.object().shape({
    id: Yup.number().required(),
    jobTitle: Yup.string().max(30).min(3),
    description: Yup.string().max(2000),
    requiredSkills: Yup.array().of(Yup.string()),
    numberOfOpenings: Yup.number(),
    category: Yup.string(),
    ctc: Yup.number(),
    applyBy: Yup.date(),
    startDate: Yup.date(),
  }),
  params: Yup.object().shape({ id: Yup.string().required() }),
};
