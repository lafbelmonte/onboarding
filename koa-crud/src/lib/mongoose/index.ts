import mongoose from 'mongoose';

async function initializeDatabase(): Promise<void> {
  try {
    await mongoose.connect(
      `mongodb://root:lostintheabyss@localhost:27017/onboarding?authSource=admin`,
      { useNewUrlParser: true },
    );
  } catch (e) {
    throw new Error(e);
  }
}

export { initializeDatabase };
