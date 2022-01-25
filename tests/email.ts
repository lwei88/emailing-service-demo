import 'jest';
import request from 'supertest';
import api from '../src/api';
import connect from '../src/utils/messageQueue/connect';

describe('POST /email/send', () => {
  beforeAll(async () => {
    const [conn, ch] = await connect(process.env.MESSAGEQUEUE_CONNECTION as string);
    await conn.close();
  });

  it('can send email', async () => {
    const res = await request(api).post(`/email/send`).set('Accept', 'application/json').send({
      from: 'testing@email.com',
      to: 'liang_wei88@hotmail.com',
      subject: 'testing',
      html: '<html><head></head><body><h1>Testing Email</h1></body></html>',
    });
    expect(res.status).toEqual(200);
  });
});
