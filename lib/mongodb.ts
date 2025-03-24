// // This file would handle MongoDB connection
// // In a real application, you would use a proper MongoDB client

// import { MongoClient } from "mongodb"

// // Replace with your actual MongoDB connection string
// // In production, this would come from environment variables
// const MONGODB_URI =
//   "mongodb+srv://bijbio:bijbio123@bijbio.t3yg1.mongodb.net/?retryWrites=true&w=majority&appName=bijbio"
// // NOTE: In production, store this in .env.local as MONGODB_URI

// // Check if we're in development or production
// const isDev = process.env.NODE_ENV === "development"

// let cachedClient: MongoClient | null = null
// let cachedDb: any = null

// export async function connectToDatabase() {
//   // If we already have a connection, use it
//   if (cachedClient && cachedDb) {
//     return { client: cachedClient, db: cachedDb }
//   }

//   // Create a new connection
//   const client = new MongoClient(MONGODB_URI)
//   await client.connect()
//   const db = client.db("scanpos")

//   // Cache the connection
//   cachedClient = client
//   cachedDb = db

//   return { client, db }
// }



import mongoose from "mongoose"

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/scanpos"

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable")
}

let cached = (global as any).mongoose || { conn: null, promise: null }
;(global as any).mongoose = cached

async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    }).then((mongoose) => mongoose)
  }

  cached.conn = await cached.promise
  console.log("✅ Connected to MongoDB")
  return cached.conn
}

export default connectToDatabase

