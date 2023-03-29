import Bluebird from 'bluebird';
import mongoose, { ClientSession } from 'mongoose';
import { Logger } from './helpers/Logger';

const { MONGODB_URI = '' } = process.env;

mongoose.Promise = Bluebird;

export const connection = mongoose.createConnection(MONGODB_URI, {
  autoCreate: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  poolSize: parseInt(<string>process.env.MONGODB_POOL_SIZE) || 30,
  // reconnectInterval: 1000,
  useUnifiedTopology: true,
  // autoReconnect: true,
  socketTimeoutMS: 45000,
  connectTimeoutMS: 5000,
  family: 4,
});

connection.on('connected', async () => {
  Logger.Info('Mongo Connection Established');
});

connection.on('error', err => {
  Logger.Error('Mongo Connection Error', err.message, err.stack);
  process.exit(1);
});

connection.on('disconnected', () => {
  Logger.Error('Mongo Connection disconnected');
});

process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    Logger.Info('Mongoose default connection disconnected through app termination');
    process.exit(0);
  });
});

process.on('unhandledRejection', function(err: any) {
  err = err.originalError || err;

  if (err.codeName === 'IllegalOperation' && /replica set/i.test(err.message || err.errmsg)) {
    Logger.Info('Transactions not supported, using no transactions');
  }
});

type SessionResult = (session?: ClientSession) => Promise<any>;

export const execInSession = async <T = SessionResult | void>(dbName: string, fn: SessionResult): Promise<T> => {
  let isStarted = false;

  const db = connection.useDb(dbName);
  const session = await db.startSession();

  try {
    session.startTransaction();

    isStarted = true;

    const result = await fn(session);
    await session.commitTransaction();

    return result;
  } catch (err) {
    // eslint-disable-next-line no-ex-assign
    err = err.originalError || err;

    if (err.codeName === 'IllegalOperation' && /replica set/i.test(err.errmsg)) {
      return fn();
    } else if (isStarted && session) {
      session.abortTransaction();
    }

    throw err;
  }
};
