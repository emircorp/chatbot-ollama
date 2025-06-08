import { ChatBody } from '@/types/chat';

export const config = {
  runtime: 'edge',
};

const handler = async (req: Request): Promise<Response> => {
  try {
    const { prompt } = (await req.json()) as ChatBody;

    if (!prompt) {
      return new Response(JSON.stringify({ error: 'Prompt eksik.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const brainRes = await fetch(process.env.BRAIN_API_URL || '', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    const data = await brainRes.json();

    return new Response(
      JSON.stringify({ response: data.response ?? 'Yanıt yok.' }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('brAIn API hatası:', error);
    return new Response(
      JSON.stringify({
        error: 'Sunucu hatası',
        message: error instanceof Error ? error.message : 'Bilinmeyen hata',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};

export default handler;
