import { connect } from 'mongoose';
import 'dotenv/config';

async function connectDB() {
  try {
    await connect(process.env.MONGODB_URI || "")
    console.log("db connected")

  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

export default connectDB
