import dotenv from "dotenv";
import { GoogleGenAI } from '@google/genai';
dotenv.config();

// Initialize the client. It automatically picks up the GEMINI_API_KEY environment variable.
const ai = new GoogleGenAI({apiKey:process.env.GEMINI_API});

async function generateText() {
  // Make the API call using the standard primitive model
  const interaction = await ai.interactions.create({
    model: 'gemini-3.5-flash',
     system_instruction:'this are telegram posts,summarize them',
    input: 'Explain how Node.js works in one sentence.',
  });

  
  console.log(interaction.output_text);
}

generateText();
