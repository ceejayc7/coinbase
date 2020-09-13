const questions = [
  {
    type: 'text',
    name: 'pair',
    message: 'What pair are you trading? (i.e., BTC-USD or ETH-USD)',
    validate: (value) => (value === 'BTC-USD' || value === 'ETC-USD' ? true : false)
  },
  {
    type: 'number',
    name: 'orderPrice',
    message: 'What price should the stoploss order be placed?',
    float: true,
    round: 2
  },
  {
    type: 'number',
    name: 'slStopPrice',
    message: 'SL - Stop Price:',
    float: true,
    round: 2
  },
  {
    type: 'number',
    name: 'slAmount',
    message: 'SL - Amount :',
    float: true,
    round: 10
  },
  {
    type: 'number',
    name: 'slLimitPrice',
    message: 'SL - Limit Price:',
    float: true,
    round: 2
  }
];

const subscription = {
  type: 'subscribe',
  product_ids: ['BTC-USD', 'ETH-USD'],

  channels: [
    {
      name: 'ticker',
      product_ids: ['BTC-USD', 'ETH-USD']
    }
  ]
};

module.exports.questions = questions;
module.exports.subscription = subscription;
