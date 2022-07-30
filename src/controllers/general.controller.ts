import boom from '@hapi/boom';
import { NextFunction, Request, Response } from 'express';

import { JobSearchType, Pagination, RequestResponse, UserType } from '../@types';
import logger from '../config/logger';
import { City } from '../models/city-state-country/city.schema';
import { Country } from '../models/city-state-country/country.schema';
import { State } from '../models/city-state-country/state.schema';
import { Employer } from '../models/employer.schema';
import { JobCategory } from '../models/jobCategories.schema';
import { Job, JobDoc } from '../models/jobs.schema';
import { JobSeeker } from '../models/jobseekers.schema';
import { Skill } from '../models/skills.schema';
import { JobSearchData } from '../validators/job.validator';

export const getJobCategories = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const jobCategories = await JobCategory.find({}).lean();
    res.send(jobCategories);
  } catch (error) {
    logger.error(error);
    next(boom.internal(RequestResponse.SERVER_ERROR));
  }
};

export const searchSkills = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const query = req.query.q;
  try {
    const skills = await Skill.aggregate([
      {
        $search: {
          index: 'skills-index',

          autocomplete: {
            query,
            path: 'name',
            fuzzy: {
              maxEdits: 2,
              prefixLength: 3,
            },
          },
        },
      },
      {
        $limit: 10,
      },
    ]);
    res.send(skills);
  } catch (error) {
    logger.error(error);
    next(boom.internal(RequestResponse.SERVER_ERROR));
  }
};

export const searchJobs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const data = req.query as unknown as JobSearchData;

  const { page, limit, query, type } = data;

  const skipIndex = (page - 1) * limit;

  let jobs: JobDoc[] = [];
  let count = 0;
  try {
    if (type === JobSearchType.JOB_TITLE) {
      jobs = await Job.find({ jobTitle: { $regex: query, $options: 'i' } })
        .populate([{ path: 'employer', select: 'company' }, { path: 'category' }, { path: 'requiredSkills' }])
        .skip(skipIndex)
        .limit(limit)
        .lean();

      count = await Job.countDocuments({ jobTitle: { $regex: query, $options: 'i' } });
    }
    if (type === JobSearchType.COMPANY) {
      const employers = await Employer.find({ 'company.name': { $regex: query, $options: 'i' } });

      if (employers.length > 0) {
        const empIDs = employers.map(emp => emp._id);
        jobs = await Job.find({ employer: { $in: empIDs } })
          .populate([{ path: 'employer', select: 'company' }, { path: 'category' }, { path: 'requiredSkills' }])
          .skip(skipIndex)
          .limit(limit)
          .lean();

        count = await Job.countDocuments({ employer: { $in: empIDs } });
      }
    }
    if (type === JobSearchType.LOCATION) {
      const [city] = query.split(',');
      const employers = await Employer.find({ 'address.$.city': city });
      if (employers.length > 0) {
        const empIDs = employers.map(emp => emp._id);
        jobs = await Job.find({ employer: { $in: empIDs } })
          .populate([{ path: 'employer', select: 'company' }, { path: 'category' }, { path: 'requiredSkills' }])
          .skip(skipIndex)
          .limit(limit)
          .lean();

        count = await Job.countDocuments({ employer: { $in: empIDs } });
      }
    }

    if (type === JobSearchType.SKILL) {
      const skill = await Skill.findOne({ name: query });
      if (skill) {
        jobs = await Job.find({ requiredSkills: { $in: [skill._id] } })
          .populate([{ path: 'employer', select: 'company' }, { path: 'category' }, { path: 'requiredSkills' }])
          .skip(skipIndex)
          .limit(limit)
          .lean();

        count = await Job.countDocuments({ requiredSkills: { $in: [skill._id] } });
      }
    }

    if (type === JobSearchType.CATEGORY) {
      const category = await JobCategory.findOne({ name: query });
      if (category) {
        jobs = await Job.find({ category: category._id })
          .populate([{ path: 'employer', select: 'company' }, { path: 'category' }, { path: 'requiredSkills' }])
          .skip(skipIndex)
          .limit(limit)
          .lean();

        count = await Job.countDocuments({ category: category._id });
      }
    }

    res.send({ jobs, count });
  } catch (error) {
    logger.error(error);
    next(boom.internal(RequestResponse.SERVER_ERROR));
  }
};

export const getSkills = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const page = req.query.page as unknown as number;
  const limit = req.query.limit as unknown as number;

  const skipIndex = (page - 1) * limit;
  try {
    const skills = await Skill.find().skip(skipIndex).limit(limit).lean();
    const count = await Skill.countDocuments();
    res.send({ skills, count });
  } catch (error) {
    logger.error(error);
    next(boom.internal(RequestResponse.SERVER_ERROR));
  }
};

export const getCountries = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const countries = await Country.find({}).lean();
    res.send({ countries });
  } catch (error) {
    logger.error(error);
    next(boom.internal(RequestResponse.SERVER_ERROR));
  }
};

export const getStatesByCountry = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { countryID } = req.params;
  try {
    const states = await State.find({ countryID }).lean();
    res.send({ states });
  } catch (error) {
    logger.error(error);
    next(boom.internal(RequestResponse.SERVER_ERROR));
  }
};

export const getCitiesByState = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { stateID } = req.params;
  try {
    const cities = await City.find({ stateID }).lean();
    res.send({ cities });
  } catch (error) {
    logger.error(error);
    next(boom.internal(RequestResponse.SERVER_ERROR));
  }
};

export const getJobs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { currentUser, query } = req;
  const { page } = query;
  const skipCount = (Number(page) - 1) * Number(Pagination.JOB_PAGE_SIZE);
  try {
    let dbQuery = Job.find()
      .populate([{ path: 'employer', select: 'company' }, { path: 'category' }, { path: 'requiredSkills' }])
      .skip(skipCount)
      .limit(Pagination.JOB_PAGE_SIZE)
      .lean();

    let countFilter = {};
    //* if the user is logged in as job seeker send only jobs that match his profile
    if (currentUser && currentUser.utype === UserType.JOBSEEKER) {
      const jobSeeker = await JobSeeker.findOne({ _id: currentUser.id });

      if (jobSeeker) {
        dbQuery = Job.find({
          category: { $in: jobSeeker.jobPreferences },
          requiredSkills: { $in: jobSeeker.skills },
        })
          .populate([{ path: 'employer', select: 'company' }, { path: 'category' }, { path: 'requiredSkills' }])
          .skip(skipCount)
          .limit(Pagination.JOB_PAGE_SIZE)
          .lean();

        countFilter = { category: { $in: jobSeeker.jobPreferences } };
      }
    }

    const jobs = await dbQuery;

    const count = await Job.countDocuments(countFilter);

    res.send({ jobs, count });
  } catch (error) {
    logger.error(error);
    next(boom.internal(RequestResponse.SERVER_ERROR));
  }
};

export const getJob = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;
  try {
    const job = await Job.findOne({ id })
      .populate([{ path: 'employer', select: 'company' }, { path: 'category' }, { path: 'requiredSkills' }])
      .lean();
    if (!job) {
      next(boom.notFound('Job not found'));
      return;
    }

    res.send({ job });
  } catch (error) {
    logger.error(error);
    next(boom.internal(RequestResponse.SERVER_ERROR));
  }
};
