import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const CONNECTDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Database Connected');
  } catch (err) {
    console.log(err.message);
    process.exit(1);
  }
};

export default CONNECTDB;
