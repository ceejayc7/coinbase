# coinbase
Coinbase stoploss automation. If price reaches a certain point, execute a stoploss order in the orderbook

## Usage
Create `.env` and `.envdev` files (dev for testing)
File structure:
```
ENDPOINT=
WS=
ACCESS_KEY=
SECRET_KEY=
PASSPHRASE=
```

- Coinbase dev endpoint: `https://api-public.sandbox.pro.coinbase.com`
- WS dev: `wss://ws-feed-public.sandbox.pro.coinbase.com`

- Coinbase prod endpoint: `https://api.pro.coinbase.com`
- WS prod: `wss://ws-feed.pro.coinbase.com`

- More info found here - https://docs.pro.coinbase.com/

`npm run start` to run using production enviornment endpoints
`npm run start:dev` to run using dev environment
