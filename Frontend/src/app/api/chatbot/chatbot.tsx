import { NextApiRequest, NextApiResponse } from 'next';
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: 'sk-None-RlnCuCKODI8Pnf0ZWOyUT3BlbkFJGE847aYQIrirxfvI4tVV', // Replace with your actual OpenAI API key
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { message } = req.body;

    try {
      // Request to OpenAI's Chat Completions API
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo', // Ensure this is the correct model name
        messages: [{ role: 'user', content: message }],
        temperature: 0.7,
      });

      const reply = response.choices[0]?.message?.content.trim() || 'Sorry, I didn\'t get that.';
      res.status(200).json({ reply });
    } catch (error) {
      console.error('Error in API handler:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
