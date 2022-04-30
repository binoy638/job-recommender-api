import mongoose from 'mongoose';

import logger from './logger';

const connectMongo = async (): Promise<void> => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const connection = await mongoose.connect(process.env.MONGO_URI!);

    if (connection) {
      logger.info(`connected to mongo`);
    }
  } catch (error) {
    logger.error(error);
    throw new Error('Error connecting to MongoDB');
  }
};

export default connectMongo;
