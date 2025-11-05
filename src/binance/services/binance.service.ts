import {
  BadRequestException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  RequestTimeoutException,
  ServiceUnavailableException
} from '@nestjs/common'
import Axios from 'axios'
import { appConfig } from '../../configuration/appConfig'
import { TradeResponse } from '../interfaces/trade.interface'
import { TradeMapper } from '../mappers/trade.mapper'
import axiosRetry, { isIdempotentRequestError } from 'axios-retry'

@Injectable()
export class BinanceService {
  private readonly API_KEY: string
  private readonly SECRET_KEY: string
  private readonly BASE_URL: string = 'https://testnet.binance.vision/api'
  private readonly DEFAULT_TIMEOUT_MS: number = 3000
  private readonly RETRY_DELAY_MS: number = 500
  private readonly MAX_RETRIES: number = 3
  private readonly DEFAULT_TRADE_FETCH_LIMIT: number = 100

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
      startTime: startDate.getTime(),
      endTime: endDate.getTime(),
      limit: this.DEFAULT_TRADE_FETCH_LIMIT
    }

    try {
      const response = await Axios.get<TradeResponse[]>(`${this.BASE_URL}/v3/aggTrades`, {
        timeout: this.DEFAULT_TIMEOUT_MS,
        headers: {
          'X-MBX-APIKEY': this.API_KEY
        },
        params: {
          ...params
        }
      })
      return TradeMapper.fromResponsesToDTOs(response.data)
    } catch (error) {
      this.handleFetchError(error)
      throw new InternalServerErrorException('An unexpected error occurred')
    }
  }

  private handleFetchError(error: any): void {
    // Handle axios timeout error
    if (error.code === 'ECONNABORTED') {
      throw new RequestTimeoutException('Request to Binance API timed out')
    }
    // Handle errors from Binance
    const errorCode = error.response.status

    if (errorCode >= 500 || errorCode === HttpStatus.REQUEST_TIMEOUT || errorCode === HttpStatus.TOO_MANY_REQUESTS) {
      throw new ServiceUnavailableException('Service is temporarily unavailable')
    }

    if (errorCode >= 400 && errorCode < 500) {
      throw new BadRequestException('Invalid request to Binance')
    }
  }

  private configureAxiosRetry() {
    axiosRetry(Axios, {
      retries: this.MAX_RETRIES,
      retryDelay: () => this.RETRY_DELAY_MS,
      retryCondition: error =>
        isIdempotentRequestError(error) ||
        error.response?.status === HttpStatus.TOO_MANY_REQUESTS ||
        error.response?.status === HttpStatus.REQUEST_TIMEOUT
    })
  }
}
