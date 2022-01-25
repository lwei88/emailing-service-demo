import dotenv from 'dotenv';
dotenv.config({ path: process.env.ENV_FILE });

import app from './api';

const start = (p: number) => {
  try {
    app.listen(p, () => {
      console.log(`Server started, listening to port ${p}....`);
    });
  } catch (err) {
    console.error(err);
    process.exit();
  }
};

const port = parseInt(process.env.PORT as string);
start(port);
