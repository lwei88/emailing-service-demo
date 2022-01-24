import amqp from 'amqplib';
import 'dotenv/config';

async function add<T>(messageQueue: string, messageBody: T) {
  let connection = null;
  try {
    connection = await amqp.connect(process.env.MESSAGEQUEUE_CONNECTION as string);
    const channel = await connection.createChannel();
    await channel.assertExchange('default', 'direct', { durable: false });

    await channel.assertQueue(messageQueue, {
      durable: true,
    });
    await channel.bindQueue(messageQueue, 'default', messageQueue);
    await channel.publish('default', messageQueue, Buffer.from(JSON.stringify(messageBody)), { persistent: true });
    await channel.close();
    console.log('[x] Sent queue');
  } catch (error) {
    console.error('Error occured: %s', error);
  } finally {
    if (connection) connection.close();
  }
}

export default add;
