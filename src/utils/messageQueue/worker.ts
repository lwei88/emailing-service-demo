import amqp from 'amqplib';
import connect from './connect';

class Worker<T> {
  startWork: (args: T) => void;
  constructor(startWork: (args: T) => void) {
    this.startWork = startWork;
  }

  static async onMessage<T>(channel: amqp.Channel, startWork: (args: T) => void, msg: amqp.ConsumeMessage | null) {
    if (msg) {
      const timeStamp = Date.now();

      console.log(`[*] - ${new Date().toISOString()} - Received queue (${timeStamp})`);
      await startWork(JSON.parse(msg.content.toString()));
      channel.ack(msg);
      console.log(`[*] - ${new Date().toISOString()} - Done (${timeStamp})`);
    }
  }

  async start(mqConn: string, messageQueue: string) {
    const [conn, ch] = await connect(mqConn);
    try {
      await ch.assertExchange('default', 'direct', { durable: false });
      await ch.assertQueue(messageQueue, {
        durable: true,
      });
      await ch.bindQueue(messageQueue, 'default', messageQueue);
      await ch.prefetch(1);

      const onMessageCb = (msg: amqp.ConsumeMessage | null): void => {
        Worker.onMessage<T>(ch, this.startWork, msg);
      };

      console.log('[*] Waiting for messages in %s. To exit press CTRL+C', messageQueue);
      await ch.consume(messageQueue, onMessageCb, { noAck: false, arguments: { redelivered: false } });
    } catch (error) {
      console.error('Error occured: %s', error);
    }
  }
}

export default Worker;

// let channel: amqp.Channel;

//     async function init(mqConn: string): Promise<amqp.Channel> {
//       const connection = await amqp.connect(mqConn);
//       return connection.createChannel();
//     }

//     const retryConnection = setInterval(async () => {
//       console.log('Connecting to MQ....');
//       if (!channel) {
//         try {
//           channel = await init(mqConn);
//         } catch (e: any) {
//           console.log(e.message);
//         }
//       } else {
//         clearInterval(retryConnection);
//         console.log('Connected to MQ');

//         await channel.assertExchange('default', 'direct', { durable: false });
//         await channel.assertQueue(messageQueue, {
//           durable: true,
//         });
//         await channel.bindQueue(messageQueue, 'default', messageQueue);
//         await channel.prefetch(1);

//         const onMessageCb = (msg: amqp.ConsumeMessage | null): void => {
//           Worker.onMessage<T>(channel, this.startWork, msg);
//         };

//         console.log('[*] Waiting for messages in %s. To exit press CTRL+C', messageQueue);
//         await channel.consume(messageQueue, onMessageCb, { noAck: false, arguments: { redelivered: false } });
//       }
//     }, 5_000);
//   }
