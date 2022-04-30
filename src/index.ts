import cors from 'cors';
import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import logger from './config/logger';
import connectMongo from './config/mongo';

dotenv.config();

const PORT = process.env.PORT || 8080;

const app = express();

//* Middilewares
app.use(helmet());
app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send({
    message: 'Hello Worlds',
  });
});

app.listen(PORT, async () => {
  await connectMongo();
  logger.info(`Listening at http://localhost:${PORT}`);
});
