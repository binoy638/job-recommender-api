import boom from '@hapi/boom';
import { NextFunction, Request, Response } from 'express';

import { RequestResponse } from '../@types';
import logger from '../config/logger';
import { City } from '../models/city-state-country/city.schema';
import { Country } from '../models/city-state-country/country.schema';
import { State } from '../models/city-state-country/state.schema';
import { JobCategory } from '../models/jobCategories.schema';
import { Skill } from '../models/skills.schema';

//! need pagination support
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
