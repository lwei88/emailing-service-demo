import { Router, Request, Response } from 'express';
import Joi from 'joi';

import addQueue from '../utils/messageQueue/add';
import Email from './models/Email';

const router = Router();

router.post('/send', async (req: Request, res: Response) => {
  try {
    // Checking for request schema
    await Joi.object({
      from: Joi.string().required(),
      to: Joi.string().email().required(),
      subject: Joi.string().required(),
      html: Joi.string().required(),
    }).validateAsync(req.body);

    const email: Email = req.body;
    await addQueue<Email>('email-queue', email);
    return res.status(200).end();
  } catch (error) {
    return res.status(400).send(error);
  }
});

export default router;
