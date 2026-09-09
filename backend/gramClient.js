import 'dotenv/config';
import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions/index.js';
import input from 'input';

const apiId = Number(process.env.App_api_id);
const apiHash = process.env.App_api_hash;
const stringSession = new StringSession(''); // empty on first run

const client = new TelegramClient(stringSession, apiId, apiHash, {
  connectionRetries: 5,
});

await client.start({
  phoneNumber: async () => process.env.TELEGRAM_PHONE,
  password: async () => await input.text('Enter your 2FA password (if any): '),
  phoneCode: async () => await input.text('Enter the code Telegram sent you: '),
  onError: (err) => console.log(err),
});

console.log('Logged in!');
console.log('SAVE THIS SESSION STRING:', client.session.save());