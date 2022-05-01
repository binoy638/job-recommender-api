import { Request, Response } from 'express';

export const register = async (req: Request, res: Response): Promise<void> => {
  res.send('register');
};
