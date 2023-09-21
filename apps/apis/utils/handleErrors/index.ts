import { NextApiResponse } from 'next';

export const handleErrors = (err: Error, res: NextApiResponse) => {
  switch (err.message) {
    case 'InvalidObjectId':
      res.status(400).json({ status: 400, error: 'Invalid id format' });
      break;
    case 'MissingInvalidParam':
      res
        .status(400)
        .json({ status: 400, error: 'Missing or invalid parameters' });
      break;
    case 'DocumentNotFound':
      res.status(404).json({ status: 404, error: 'Document not found' });
      break;
    case 'MongoError':
      res
        .status(500)
        .json({ status: 500, error: 'Database connection failed' });
      break;
    case 'UserAlreadyExists':
      res.status(400).json({
        status: 400,
        error: 'The user already exists',
      });
      break;
    default:
      res.status(500).json({ status: 500, error: 'Unknown error' });
  }
};
