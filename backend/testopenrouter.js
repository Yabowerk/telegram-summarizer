import { OpenRouter } from '@openrouter/sdk';

async function main() {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'microsoft/microsoft-decision-1',
      messages: [{ role: 'user', content: 'What is the meaning of life?' }],
    }),
  });
  const data = await response.json();
  console.log(data.choices[0].message.content);
}
main();