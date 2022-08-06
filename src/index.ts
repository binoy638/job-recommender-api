/* eslint-disable unicorn/no-process-exit */
import cookieSession from 'cookie-session';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import logger from './config/logger';
import connectMongo from './config/mongo';
import errorHandler from './middlewares/errorHandler.middleware';
import notFoundHandler from './middlewares/notFoundHandler.middleware';
import { Admin } from './models/admin.schema';
import adminRouter from './routers/admin.router';
import authRouter from './routers/auth.router';
import employerRouter from './routers/employer.route';
import generalRouter from './routers/generalRouter';
import jobseekerRouter from './routers/jobseeker.router';

dotenv.config();

const isDevelopment = process.env.NODE_ENV === 'development';

const PORT = process.env.PORT || 5000;

const app = express();

//* Middilewares
app.use(helmet());
app.use(morgan('common'));
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.set('trust proxy', true);

app.use(
  cookieSession({
    secret: process.env.COOKIE_SECRET!,
    maxAge: 24 * 60 * 60 * 1000 * 7,
    sameSite: 'none',
    secure: !isDevelopment,
    httpOnly: !isDevelopment,
  })
);

//* register routers
app.use('/api', generalRouter);
app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter);
app.use('/api/employer', employerRouter);
app.use('/api/jobseeker', jobseekerRouter);

app.listen(PORT, async () => {
  try {
    await connectMongo();
    logger.info(`Listening at http://localhost:${PORT}`);

    if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD || !process.env.JWT_SECRET) {
      throw new Error('Env variables missing');
    } else {
      const existingAdmin = await Admin.findOne({ email: process.env.ADMIN_EMAIL });
      if (!existingAdmin) {
        const newAdmin = new Admin({
          email: process.env.ADMIN_EMAIL,
          password: process.env.ADMIN_PASSWORD,
        });
        await newAdmin.save();
        logger.info('Admin user created');
      } else {
        logger.info('Admin user already exists');
      }
    }
  } catch (error) {
    logger.error(error);
    process.exit();
  }
});

//* Error handler middleware
app.use(notFoundHandler);
app.use(errorHandler);
