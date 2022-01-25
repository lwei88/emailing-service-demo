import amqp from 'amqplib';

function wait(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

const retryConnection = async (mqConn: string): Promise<[amqp.Connection, amqp.Channel]> => {
  console.log('Connecting to MQ...');
  const connection = await amqp.connect(mqConn);
  const channel = await connection.createChannel();

  if (connection && channel) {
    console.log('Connected');
    return [connection, channel];
  } else {
    console.log('Retry in 5sec...');
    await wait(5000);
    return await retryConnection(mqConn);
  }
};

export default retryConnection;
