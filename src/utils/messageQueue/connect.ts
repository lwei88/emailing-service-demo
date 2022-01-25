import amqp from 'amqplib';

function wait(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

const retryConnection = async (mqConn: string): Promise<[amqp.Connection, amqp.Channel]> => {
  let channel: amqp.Channel;
  let connection: amqp.Connection;
  console.log('Connecting to MQ...');

  try {
    connection = await amqp.connect(mqConn);
    channel = await connection.createChannel();
    return [connection, channel];
  } catch (e: any) {
    console.log(e.message);
    await wait(5000);
    return await retryConnection(mqConn);
  }
};

export default retryConnection;
