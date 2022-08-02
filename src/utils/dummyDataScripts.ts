/* eslint-disable unicorn/new-for-builtins */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable consistent-return */
/* eslint-disable unicorn/numeric-separators-style */
import { faker } from '@faker-js/faker';
import { Schema } from 'mongoose';

import { Employer } from '../models/employer.schema';
import { JobCategory } from '../models/jobCategories.schema';
import { JobAttrs, JobMode, WorkHours } from '../models/jobs.schema';
import { JobSeekerAttrs } from '../models/jobseekers.schema';
import { Skill } from '../models/skills.schema';
import { generateID } from './generateID';

const description =
  '<p><strong>Responsibilities :</strong></p><p><br></p><p><br></p><ul><li>Coding complex modules</li><li>Code review and enforcing best practices</li><li>Improve Application architecture</li><li>Constantly improve his/her own skill set</li><li>Customizations to existing open source or custom built applications</li><li>Building a knowledge base of the latest programming trends, best practices, and methodologies</li></ul><p><strong>Education &amp; Experience:</strong></p><ul><li>Experience in Javascript frameworks (Node.js, Angular.js/Reactjs)</li><li>Relevant Experience should be 3-6 years</li><li>B.Tech/ BCA/ MCA or M.Tech</li><li>Impeccable written and verbal communication skills with the ability to present, explain and defend design concepts in team and stakeholder meetings</li><li>Experience representing work to a broader product team and other leaders, clearly and succinctly articulating the goals and concepts</li><li>Knowledge of Typescript and Loopback.io would be an added advantage</li></ul><p><strong><u>Personal Characteristics:</u></strong></p><ul><li>Strong portfolio and excellent attitude</li><li>Must be self-confident to work in a team and individually</li><li>Ability to drive the project with the team</li><li>Detail oriented and ability to organize</li><li>Problem-solving and innovation skills are a must</li><li>Delivery oriented and able to work under strict deadlines</li><li>Strong communication skills</li></ul><p><br></p>';

function randomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min);
}

const randomSalary = (): { negotiable: boolean; min: number; max: number } | undefined => {
  if (randomNumber(0, 2) === 0) return;
  const min = randomNumber(2, 20);
  const minSalary = min * 100000;
  const max = randomNumber(min, 20);
  const maxSalary = max * 100000;
  return {
    negotiable: randomNumber(0, 2) === 1,
    min: minSalary,
    max: maxSalary,
  };
};

export const createRandomJob = async (): Promise<Partial<JobAttrs>> => {
  const [employer] = await Employer.aggregate([{ $sample: { size: 1 } }]);
  const [category] = await JobCategory.aggregate([{ $sample: { size: 1 } }]);
  const skills = await Skill.aggregate([{ $sample: { size: randomNumber(1, 10) } }]);
  const requiredSkills = skills.map(skill => skill._id);

  if (!employer) {
    throw new Error('No employer found');
  }

  const salary = randomSalary();
  const data = {
    jobTitle: faker.name.jobTitle(),
    id: generateID(),
    employer: employer._id,
    category: category._id,
    numberOfOpenings: Math.floor(Math.random() * 10),
    mode: Math.floor(Math.random() * 100) % 2 === 0 ? JobMode.WFO : JobMode.WFH,
    workHours: Math.floor(Math.random() * 100) % 2 === 0 ? WorkHours.FULLTIME : WorkHours.PARTTIME,
    requiredSkills,
    applyBy: faker.date.future() as unknown as Schema.Types.Date,
    startDate: faker.date.future() as unknown as Schema.Types.Date,
    description,
  } as Partial<JobAttrs>;

  if (salary) {
    data.salary = salary;
  }
  return data;
};

// export const generateJobs = () => {

// }

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

const generateEdu = () => {
  return {
    degree: degrees[Math.floor(Math.random() * degrees.length)],
    institute: faker.company.companyName(),
    startYear: faker.date.past().getFullYear(),
    endYear: faker.date.past().getFullYear(),
    percentage: Math.floor(Math.random() * 100),
  };
};

const generateExp = () => {
  return {
    role: faker.name.jobTitle(),
    company: faker.company.companyName(),
    startYear: faker.date.past().getFullYear(),
    endYear: faker.date.past().getFullYear(),
    description: faker.lorem.paragraph(),
  };
};

export const createRandomJobSeeker = async (): Promise<Omit<JobSeekerAttrs, 'createdAt' | 'updatedAt'>> => {
  const categories = await JobCategory.aggregate([{ $sample: { size: randomNumber(1, 3) } }]);
  const jobPreferences = categories.map(cat => cat._id);
  const skillsDocs = await Skill.aggregate([{ $sample: { size: randomNumber(1, 10) } }]);
  const skills = skillsDocs.map(skill => skill._id);

  const education = [...Array(randomNumber(1, 4))].map(() => generateEdu());
  const experience = [...Array(randomNumber(0, 3))].map(() => generateExp());

  return {
    // id: generateID(),
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
    education,
    experience,
    skills,
    jobPreferences,
  };
};
