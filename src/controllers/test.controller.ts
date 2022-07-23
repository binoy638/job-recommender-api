/* eslint-disable sonarjs/no-duplicate-string */
// eslint-disable-next-line import/no-extraneous-dependencies
import { faker } from '@faker-js/faker';
import boom from '@hapi/boom';
import { NextFunction, Request, Response } from 'express';
import { Schema } from 'mongoose';

import { RequestResponse } from '../@types';
import logger from '../config/logger';
import { EmployerAttrs } from '../models/employer.schema';
import { JobAttrs, JobMode, WorkHours } from '../models/jobs.schema';
import { JobSeekerAttrs } from '../models/jobseekers.schema';

export function createRandomEmployer(): Omit<EmployerAttrs, 'createdAt' | 'updatedAt'> {
  return {
    firstName: faker.name.firstName(),
    // id: generateID(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    phone: faker.phone.phoneNumber('##########'),
    company: {
      name: faker.company.companyName(),
      description: faker.lorem.paragraph(),
      yearFounded: faker.date.past().getFullYear(),
      employees: Math.floor(Math.random() * 1000),
      website: faker.internet.url(),
      logo: faker.image.avatar(),
      address: {
        city: faker.address.city(),
        state: faker.address.state(),
        country: faker.address.country(),
      },
    },
    isVerified: false,
    isBanned: false,
  };
}

export const getRandomEmployerData = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const employer = createRandomEmployer();
    res.send(employer);
  } catch (error) {
    logger.error(error);
    next(boom.internal(RequestResponse.SERVER_ERROR));
  }
};

const degrees = [
  'Bachelors in Computer Science and IT',
  'Bachelors in Electrical Engineering',
  'Bachelors in Civil Engineering and Construction',
  'Bachelors in Medicine',
  'Bachelors in Architecture',
  'Bachelors in Design',
  'Bachelors in International Relations',
  'Bachelors in Language Studies',
  'Masters in Computer Science and IT',
  'Masters in Electrical Engineering',
  'Masters in Civil Engineering and Construction',
  'Masters in Medicine',
  'Masters in Architecture',
  'Masters in Design',
  'Masters in International Relations',
  'Masters in Language Studies',
];

function createRandomJobSeeker(): Omit<JobSeekerAttrs, 'createdAt' | 'updatedAt'> {
  return {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    phone: faker.phone.phoneNumber('##########'),
    dob: faker.date.past() as unknown as Schema.Types.Date,
    address: {
      city: faker.address.city(),
      state: faker.address.state(),
      country: faker.address.country(),
    },
    about: faker.lorem.paragraph(),
    education: [
      {
        degree: degrees[Math.floor(Math.random() * degrees.length)],
        institute: faker.company.companyName(),
        startYear: faker.date.past().getFullYear(),
        endYear: faker.date.past().getFullYear(),
        percentage: Math.floor(Math.random() * 100),
      },
    ],
    experience: [
      {
        role: faker.name.jobTitle(),
        company: faker.company.companyName(),
        startYear: faker.date.past().getFullYear(),
        endYear: faker.date.past().getFullYear(),
        description: faker.lorem.paragraph(),
      },
    ],
    skills: ['62a0a8863306a92e3b9fa2d6' as unknown as Schema.Types.ObjectId],
    jobPreferences: ['62a0a8863306a92e3b9fa2d6' as unknown as Schema.Types.ObjectId],
    resume: faker.image.avatar(),
  };
}

export const getRandomJobSeekerData = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const jobseeker = createRandomJobSeeker();
    res.send(jobseeker);
  } catch (error) {
    logger.error(error);
    next(boom.internal(RequestResponse.SERVER_ERROR));
  }
};

export function createRandomJob(): Partial<JobAttrs> {
  return {
    jobTitle: faker.name.jobTitle(),
    // id: generateID(),
    // employer: '62a100dbdb6897b7f08a285a',
    numberOfOpenings: Math.floor(Math.random() * 10),
    mode: Math.floor(Math.random() * 100) % 2 === 0 ? JobMode.WFO : JobMode.WFH,
    workHours: Math.floor(Math.random() * 100) % 2 === 0 ? WorkHours.FULLTIME : WorkHours.PARTTIME,
    // eslint-disable-next-line unicorn/numeric-separators-style
    applyBy: faker.date.future() as unknown as Schema.Types.Date,
    startDate: faker.date.future() as unknown as Schema.Types.Date,
    description: faker.lorem.paragraphs(),
  };
}

export const getRandomJobData = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const job = createRandomJob();
    res.send(job);
  } catch (error) {
    logger.error(error);
    next(boom.internal(RequestResponse.SERVER_ERROR));
  }
};
