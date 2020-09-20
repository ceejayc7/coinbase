const superagent = require('superagent');
const crypto = require('crypto');
const WebSocket = require('ws');
const dotenv = require('dotenv');
const prompts = require('prompts');
const { questions, subscription } = require('./config');

const envFile = process.env.NODE_ENV === 'dev' ? `.envdev` : '.env';
console.log(`Running on ${envFile}`);
dotenv.config({ path: envFile });
let input;
let ws;

const startWebsocket = () => {
  ws = new WebSocket(process.env.WS);
  ws.on('open', () => {
    ws.send(JSON.stringify(subscription));
  });

  ws.on('message', (data) => {
    const json = JSON.parse(data);
    const pair = json.product_id;
    const price = parseFloat(json.price);
    if (pair === input.pair && price <= input.orderPrice) {
      setStoploss(input);
    }
  });

  ws.on('error', (data) => {
    console.log('ERROR');
    console.log(data);
  });

  ws.on('close', (code, reason) => {
    console.log('closed');
    console.log(code);
    console.log(reason);
    // connection closed, discard old websocket and create a new one in 5s
    ws = null;
    setTimeout(startWebsocket, 5000);
    startWebsocket();
  });
};

const setStoploss = (input) => {
  // https://docs.pro.coinbase.com/#signing-a-message
  const signMessage = (method, path, body, timestamp) => {
    const bodyString = JSON.stringify(body);

    const what =
      bodyString === '{}' ? timestamp + method + path : timestamp + method + path + bodyString;
    const key = Buffer.from(process.env.SECRET_KEY, 'base64');
    const hmac = crypto.createHmac('sha256', key);

    return hmac.update(what).digest('base64');
  };

  const timestamp = Date.now() / 1000;
  const method = 'POST';
  const endpoint = '/orders';
  const body = {
    side: 'sell',
    product_id: input.pair,
    stop: 'loss',
    stop_price: input.slStopPrice,
    price: input.slLimitPrice,
    size: input.slAmount
  };
  const signature = signMessage(method, endpoint, body, timestamp);

  return superagent
    .post(`${process.env.ENDPOINT}${endpoint}`)
    .set('CB-ACCESS-KEY', process.env.ACCESS_KEY)
    .set('CB-ACCESS-SIGN', signature)
    .set('CB-ACCESS-TIMESTAMP', timestamp)
    .set('CB-ACCESS-PASSPHRASE', process.env.PASSPHRASE)
    .set('Content-Type', 'application/json')
    .set(
      'User-Agent',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)'
    )
    .send(body)
    .then((data) => {
      console.log('SUCCESS');
      console.log(`Status code: ${data.status}`);
      console.log(data.body);
      process.exit();
    })
    .catch((err) => {
      console.log('ERROR');
      console.log(`Status code: ${err.status}`);
      console.log(err.response.body);
      process.exit();
    });
};

(async () => {
  input = await prompts(questions);
  console.log(input);
  console.log(
    `When ${input.pair} trades to ${input.orderPrice}, execute a STOPLOSS order at ${input.slStopPrice} with amount ${input.slAmount} and limit sell price ${input.slLimitPrice}`
  );
  startWebsocket();
})();
