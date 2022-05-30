import cookieSession from 'cookie-session';
import cors from 'cors';
import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import logger from './config/logger';
import connectMongo from './config/mongo';
import errorHandler from './middlewares/errorHandler.middleware';
import notFoundHandler from './middlewares/notFoundHandler.middleware';
import authRouter from './routers/auth.router';

dotenv.config();

const PORT = process.env.PORT || 8080;

const app = express();

//* Middilewares
app.use(helmet());
app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());
app.use(
  cookieSession({
    //* avoid encrypting the cookies
    signed: false,
    //* https only cookies
    secure: process.env.NODE_ENV === 'production',
  })
);

//* regsiter routers
app.use('/api/auth', authRouter);

app.get('/', (req: Request, res: Response) => {
  res.send({ message: 'Welcome to the Job Recommender API' });
});

app.listen(PORT, async () => {
  try {
    await connectMongo();
    logger.info(`Listening at http://localhost:${PORT}`);
  } catch (error) {
    logger.error(error);
  }
});

//* Error handler middleware
app.use(notFoundHandler);
app.use(errorHandler);
