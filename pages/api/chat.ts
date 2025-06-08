import type { NextApiRequest, NextApiResponse } from 'next';
import { ChatBody } from '@/types/chat';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      return res.status(405).json({ error: 'Yalnızca POST isteklerine izin verilir.' });
    }

    const { prompt } = req.body as ChatBody;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt eksik.' });
    }

    const apiUrl = process.env.NEXT_PUBLIC_BRAIN_API_URL;

    if (!apiUrl) {
      return res.status(500).json({ error: 'API URL tanımlı değil.' });
    }

    const brainRes = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if (!brainRes.ok) {
      const text = await brainRes.text();
      return res.status(brainRes.status).json({ error: 'brAIn API hatası', detail: text });
    }

    const data = await brainRes.json();

    return res.status(200).json({
      response: data.response ?? 'Yanıt yok.',
    });
  } catch (error) {
    console.error('brAIn API hatası:', error);
    return res.status(500).json({
      error: 'Sunucu hatası',
      message: error instanceof Error ? error.message : 'Bilinmeyen hata',
    });
  }
};

export default handler;
