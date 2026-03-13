// import { MongoClient } from 'mongodb';

// const mongoUri = process.env.MONGODB_URI;
// const client = new MongoClient(mongoUri);

// let db;

// export async function connectDB() {
//   try {
//     await client.connect();
//     db = client.db('quiz_app');
//     console.log('Connected to MongoDB');
    
//     // Create indexes
//     await db.collection('users').createIndex({ email: 1 }, { unique: true });
//     await db.collection('questions').createIndex({ subject: 1 });
//     await db.collection('scores').createIndex({ userId: 1 });
    
//     return db;
//   } catch (error) {
//     console.error('MongoDB connection error:', error);
//     throw error;
//   }
// }

// export function getDB() {
//   if (!db) {
//     throw new Error('Database not initialized');
//   }
//   return db;
// }

// export async function closeDB() {
//   await client.close();
// }
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config(); // ensure env variables load

const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  throw new Error("❌ MONGODB_URI not found in .env file");
}

const client = new MongoClient(mongoUri);

let db;

export async function connectDB() {
  try {
    await client.connect();

    db = client.db('quiz_app');

    console.log("✅ Connected to MongoDB");

    // Create indexes
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('questions').createIndex({ subject: 1 });
    await db.collection('scores').createIndex({ userId: 1 });

    return db;

  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    throw error;
  }
}

export function getDB() {
  if (!db) {
    throw new Error("Database not initialized");
  }
  return db;
}

export async function closeDB() {
  await client.close();
}