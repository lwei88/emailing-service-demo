import express from 'express';
import cors from 'cors';
import 'dotenv/config';

import emailRoutes from './email/routes';

const app = express();

const port = parseInt(process.env.PORT as string);
app.listen(port, () => console.log(`Server started, listening to port ${port}....`));
app.use(cors());
app.use(express.json());
app.use('/email', emailRoutes);
