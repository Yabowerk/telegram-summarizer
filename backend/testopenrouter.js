import 'dotenv/config';
import { OpenRouter } from '@openrouter/sdk';

async function main() {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'apodex/apodex-1.1-mini:free',
      messages: [
        { role: 'system', content: 'respond its working whenever anything is asked' },
        { role: 'user', content: 'What is the meaning of life?' }],
    }),
  });
const data = await response.json();
  console.log(data.choices[0].message.content);
}
main();