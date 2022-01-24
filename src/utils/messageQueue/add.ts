import amqp from 'amqplib';
import 'dotenv/config';

async function sendQueue<T>(channel: amqp.Channel, messageQueue: string, messageBody: T) {
  await channel.assertExchange('default', 'direct', { durable: false });
  await channel.assertQueue(messageQueue, {
    durable: true,
  });
  await channel.bindQueue(messageQueue, 'default', messageQueue);
  await channel.publish('default', messageQueue, Buffer.from(JSON.stringify(messageBody)), { persistent: true });
  await channel.close();
  console.log('[x] Sent queue');
}

async function init(mqConn: string): Promise<amqp.Channel> {
  const connection = await amqp.connect(mqConn);
  return connection.createChannel();
}

async function add<T>(messageQueue: string, messageBody: T) {
  let channel: amqp.Channel;

  const retryConnection = setInterval(async () => {
    console.log('Connecting to MQ');
    if (!channel) {
      try {
        channel = await init(process.env.MESSAGEQUEUE_CONNECTION as string);
      } catch (e: any) {
        console.log(e.message);
      }
    } else {
      clearInterval(retryConnection);
      await sendQueue(channel, messageQueue, messageBody);
    }
  }, 5_000);
}

export default add;
