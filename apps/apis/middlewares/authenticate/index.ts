import jwt from 'jsonwebtoken';
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

export const authenticateMiddleware =
  (handler: NextApiHandler) =>
  async (req: NextApiRequest, res: NextApiResponse) => {
    const token = req.cookies.accessToken;
    /* const pbk =
      req.method == 'GET'
        ? req.query.pbk
        : req.method == 'POST'
        ? req.body.publicKey
        : ''; */

    if (!token)
      return res.status(401).json({ status: 401, error: 'Access denied' });

    try {
      // verifica il jwt
      jwt.verify(token, process.env.JWT_ACCESS_SECRET ?? '');

      // verifica che la pbk nel payload sia uguale alla pbk passata come parametro o nel body
      // const payload = jwt.decode(token) as JwtUserPayload;
      /* if (payload.publicKey !== pbk)
        return res.status(401).json({ status: 401, error: 'Access denied' }); */
    } catch (error) {
      res.status(400).json({ status: 400, error: 'Invalid token' });
    }

    return handler(req, res);
  };
