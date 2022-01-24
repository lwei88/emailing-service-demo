import amqp from 'amqplib';
import 'dotenv/config';

class Worker<T> {
  startWork: (args: T) => void;
  constructor(startWork: (args: T) => void) {
    this.startWork = startWork;
  }

  static async onMessage<U>(channel: amqp.Channel, startWork: (args: U) => void, msg: amqp.ConsumeMessage | null) {
    if (msg)
      try {
        const timeStamp = Date.now();

        console.log(`[*] - ${new Date().toISOString()} - Received queue (${timeStamp})`);
        await startWork(JSON.parse(msg.content.toString()));
        channel.ack(msg);
        console.log(`[*] - ${new Date().toISOString()} - Done (${timeStamp})`);
      } catch (error: any) {
        // nack the message, will become dead-letter which will be throw to standby queue
        channel.nack(msg, false, false);
        console.log('Error occured: %s', error.message);
      }
  }

  async start(messageQueue: string) {
    let connection = null;
    try {
      connection = await amqp.connect(process.env.MESSAGEQUEUE_CONNECTION as string);
      const channel = await connection.createChannel();
      await channel.assertExchange('default', 'direct', { durable: false });

      await channel.assertQueue(messageQueue, {
        durable: true,
      });
      await channel.bindQueue(messageQueue, 'default', messageQueue);
      await channel.prefetch(1);

      const onMessageCb = (msg: amqp.ConsumeMessage | null): void => {
        Worker.onMessage<T>(channel, this.startWork, msg);
      };

      console.log('[*] Waiting for messages in %s. To exit press CTRL+C', messageQueue);
      await channel.consume(messageQueue, onMessageCb, { noAck: false, arguments: { redelivered: false } });
    } catch (error) {
      console.error('Error occured: %s', error);
    }
  }
}

export default Worker;
