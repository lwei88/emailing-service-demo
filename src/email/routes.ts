import { Router, Request, Response } from 'express';
import Joi from 'joi';

import add from '../utils/messageQueue/add';
import connect from '../utils/messageQueue/connect';
import Email from './models/Email';

const router = Router();

router.post('/send', async (req: Request, res: Response) => {
  const [conn, ch] = await connect(process.env.MESSAGEQUEUE_CONNECTION as string);
  try {
    // Checking for request schema
    await Joi.object({
      from: Joi.string().required(),
      to: Joi.string().email().required(),
      subject: Joi.string().required(),
      html: Joi.string().required(),
    }).validateAsync(req.body);

    const email: Email = req.body;
    await add<Email>(ch, 'email-queue', email);
    return res.status(200).end();
  } catch (error) {
    return res.status(400).send(error);
  } finally {
    if (ch) ch.close();
    if (conn) conn.close();
  }
});

export default router;
