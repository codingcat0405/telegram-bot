import {createClient} from 'redis';

async function test() {

  const client = createClient({
    url: 'redis://@13.229.201.66:6379'
  });

  client.on('error', (err) => console.log('Redis Client Error', err));

  await client.connect();

  await client.set('key', 'value');
  const value = await client.get('key');
  console.log(value);
  await client.disconnect();
}

test().then()
