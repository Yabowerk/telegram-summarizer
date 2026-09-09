import 'dotenv/config';
import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions/index.js';
import mongoose from 'mongoose';


const apiId = Number(process.env.TELEGRAM_API_ID);
const apiHash = process.env.TELEGRAM_API_HASH;
const stringSession = new StringSession(process.env.TELEGRAM_SESSION);


const client = new TelegramClient(stringSession, apiId, apiHash, {
  connectionRetries: 5,
});

console.log("Connected using saved session!");
await client.connect();
export { client };
