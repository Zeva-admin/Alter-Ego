import Groq from 'groq-sdk';

export const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

export async function generateGroqReply(prompt: string): Promise<string> {
  const completion = await groq.chat.completions.create({
    model: 'llama-3-1-70b',
    messages: [
      { role: 'system', content: 'Ты умный ассистент, отвечай по делу на русском.' },
      { role: 'user', content: prompt }
    ],
    temperature: 0.7,
    max_tokens: 800
  });

  return completion.choices[0]?.message?.content?.trim() || 'Ошибка генерации ответа.';
}
