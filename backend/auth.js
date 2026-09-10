import 'dotenv/config';
import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const client = new MongoClient(process.env.MONGO_URL);
const db = client.db(); // uses the db name from your connection string

export const auth = betterAuth({
  database: mongodbAdapter(db, { client,transaction: false }),
  baseURL: process.env.BETTER_AUTH_URL,
  trustedOrigins: ["http://localhost:5173"],
  emailAndPassword: {
    enabled: true
  }
});