import { Injectable, NotFoundException } from '@nestjs/common'
import Axios from 'axios'
import * as crypto from 'crypto'
import { appConfig } from 'src/configuration/appConfig'
import { TradeResponse } from '../interfaces/trade.interface'
import { TradeMapper } from '../mappers/trade.mapper'

@Injectable()
export class BinanceService {
  private readonly API_KEY: string
  private readonly SECRET_KEY: string
  private readonly BASE_URL: string = 'https://testnet.binance.vision/api'
  private readonly DEFAULT_TIMEOUT_MS: number = 3000
  private readonly RETRY_DELAY_MS: number = 500
  private readonly MAX_RETRIES: number = 3

  constructor() {
    if (!appConfig.BINANCE_API_KEY || !appConfig.BINANCE_SECRET_KEY) {
      throw new NotFoundException('Binance API credentials not configured')
    }

    this.API_KEY = appConfig.BINANCE_API_KEY
    this.SECRET_KEY = appConfig.BINANCE_SECRET_KEY

    this.configureAxiosRetry()
  }
  public async fetchRecentTrades(startDate: Date, endDate: Date, symbol: string) {
    const params = {
      symbol,
      limit: 100
    }

    const signature = this.generateSignature(params)

    try {
      const response = await Axios.get<TradeResponse[]>(`${this.BASE_URL}/v3/trades`, {
        timeout: this.DEFAULT_TIMEOUT_MS,
        headers: {
          'X-MBX-APIKEY': this.API_KEY
        },
        params: {
          ...params,
          signature
        }
      })
      return TradeMapper.fromResponsesToDTOs(response.data)
    } catch (error) {
      this.handleFetchError()
    }
  }

  private generateSignature(params: Record<string, any>): string {
    const queryString = this.generateQueryString(params)

    return crypto.createHmac('sha256', this.BASE_URL).update(queryString).digest('hex')
  }

  private generateQueryString(params: Record<string, any>): string {
    return Object.entries(params)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&')
  }

  private
}
