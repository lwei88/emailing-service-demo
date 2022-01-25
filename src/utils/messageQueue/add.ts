import amqp from 'amqplib';

async function add<T>(channel: amqp.Channel, messageQueue: string, messageBody: T) {
  await channel.assertExchange('default', 'direct', { durable: false });
  await channel.assertQueue(messageQueue, {
    durable: true,
  });
  await channel.bindQueue(messageQueue, 'default', messageQueue);
  await channel.publish('default', messageQueue, Buffer.from(JSON.stringify(messageBody)), { persistent: true });
  console.log('[x] Sent queue');
}

export default add;
