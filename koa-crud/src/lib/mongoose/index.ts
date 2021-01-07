import mongoose from 'mongoose';

async function initializeDatabase(): Promise<void> {
  try {
    await mongoose.connect(
      `mongodb://root:lostintheabyss@localhost:27017/vendors?authSource=admin`,
      { useNewUrlParser: true },
    );

    console.log('Db connected successfully');
  } catch (e) {
    throw new Error(e);
  }
}

export { initializeDatabase };
