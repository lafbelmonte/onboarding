import mongoose from 'mongoose';

async function initializeDatabase(): Promise<void> {
  try {
    await mongoose.connect(
      `mongodb://mongo:27017/onboarding?authSource=admin`,
      { useNewUrlParser: true },
    );

    mongoose.set('runValidators', true);
  } catch (e) {
    throw new Error(e);
  }
}

export { initializeDatabase };
