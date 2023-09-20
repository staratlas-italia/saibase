import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

export const matchApiKeyMiddleware =
  (handler: NextApiHandler) =>
  async (req: NextApiRequest, res: NextApiResponse) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res
        .status(401)
        .json({ status: 401, error: 'Missing authorization header' });
    }

    const token = authHeader.split(' ')[1];

    if (token !== process.env.API_TOKEN) {
      return res
        .status(401)
        .json({ status: 401, error: 'Invalid authorization header' });
    }

    return handler(req, res);
  };
