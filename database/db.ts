import mongoose, { Connection } from 'mongoose';
let MDB: Connection | null = null;

export const connectDB = async (): Promise<Connection> => {

  const dbName = "SocialMediaDB"


  if (MDB) {
    return MDB;
  }

  let connectionUrl = `mongodb://localhost:27017/${dbName}`
  try {

    const db = await mongoose.connect(connectionUrl);
    MDB = db.connection;
    console.log('********************************************* Connected to MongoDB *****************************************')

  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw new Error('Failed to connect to MongoDB');
  }
};

export const getDb = (): Connection => {
  if (!MDB) {
    throw new Error('MongoDB connection not established');
  }
  return MDB;
};