import express from 'express';
import cors from 'cors';

import emailRoutes from './email/routes';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/email', emailRoutes);

export default app;
