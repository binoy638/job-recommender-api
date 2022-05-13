import cors from 'cors';
import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import logger from './config/logger';
import connectMongo from './config/mongo';
import errorHandler from './middlewares/errorHandler.middleware';
import notFoundHandler from './middlewares/notFoundHandler.middleware';
import employerRouter from './routers/employer.router';

dotenv.config();

const PORT = process.env.PORT || 8080;

const app = express();

//* Middilewares
app.use(helmet());
app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());

//* regsiter routers
app.use('/api/employer', employerRouter);

app.get('/', (req: Request, res: Response) => {
  //! check for env file here
  res.sendStatus(200);
});

app.listen(PORT, async () => {
  try {
    await connectMongo();
    logger.info(`Listening at http://localhost:${PORT}`);
  } catch (error) {
    logger.error(error);
  }
});

app.use(notFoundHandler);
app.use(errorHandler);
