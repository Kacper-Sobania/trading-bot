# Trading analysis API

NestJS-based REST API that integrates with Binance to provide market analysis data

## Description

The application provides market analysis including price changes and percentage variations for specified time periods and trading symbols

## Project setup

```bash
$ npm install
```

## Compile and run the project

**Environment Configuration:**
   Create a `.env` file with your Binance API credentials:
   ```
   BINANCE_API_KEY=your_api_key
   BINANCE_SECRET_KEY=your_secret_key
   PORT=3000
   ```

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev
```

## API Endpoints

### Market Analysis
```
GET /api/trading/market-analysis
```

**Query Parameters:**
- `startDate` (required): Start date for analysis (ISO date format)
- `endDate` (required): End date for analysis (ISO date format)
- `symbol` (required): Trading pair symbol (e.g., BTCUSDT)

**Response:**
```json
{
  "symbol": "BTCUSDT",
  "priceAbsoluteChange": 1250.50,
  "pricePercentageChange": 2.75
}
```
## Testing

```bash
# Unit tests
npm run test

# Test coverage
npm run test:cov
```
