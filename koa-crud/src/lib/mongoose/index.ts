import mongoose from 'mongoose';

import { MongoMemoryServer } from 'mongodb-memory-server';

const mongod = new MongoMemoryServer();

async function initializeDatabase(): Promise<void> {
  try {
    if (process.env.NODE_ENV === 'test') {
      const uri = await mongod.getConnectionString();

      const mongooseOpts = {
        useNewUrlParser: true,
        autoReconnect: true,
        reconnectTries: Number.MAX_VALUE,
        reconnectInterval: 1000,
      };

      await mongoose.connect(uri, mongooseOpts);
    } else {
      await mongoose.connect(
        `mongodb://mongo:27017/onboarding?authSource=admin`,
        { useNewUrlParser: true },
      );
    }

    mongoose.set('runValidators', true);
  } catch (e) {
    throw new Error(e);
  }
}

async function closeDatabase(): Promise<void> {
  try {
    await mongoose.connection.close();
    if (process.env.NODE_ENV === 'test') {
      await mongod.stop();
    }
  } catch (e) {
    throw new Error(e);
  }
}

export { initializeDatabase, closeDatabase };
