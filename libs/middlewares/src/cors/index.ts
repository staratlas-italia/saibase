import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

export const corsMiddleware =
  (allowedOrigins: string[]) =>
  (handler: NextApiHandler) =>
  async (req: NextApiRequest, res: NextApiResponse) => {
    const origin = req.headers.origin;

    if (origin && allowedOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PUT, DELETE, OPTIONS'
      );
      res.setHeader(
        'Access-Control-Allow-Headers',
        'Content-Type, Authorization'
      );
    }

    if (req.method === 'OPTIONS') {
      return res.json({});
    }

    return handler(req, res);
  };
