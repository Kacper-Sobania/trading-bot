import dotenv from 'dotenv'

dotenv.config()

export const appConfig = {
  BINANCE_API_KEY: process.env.BINANCE_API_KEY,
  BINANCE_SECRET_KEY: process.env.BINANCE_SECRET_KEY
}
