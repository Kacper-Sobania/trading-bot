import { BadRequestException, Injectable } from '@nestjs/common'
import { BinanceService } from '../../binance/services/binance.service'
import { MarketAnalysis, PriceAnalysis } from '../dtos/market-analysis.dto'
import { mean } from 'lodash'
import { TradeDTO } from '../../binance/interfaces/trade.interface'

@Injectable()
export class TradingService {
  constructor(private readonly binanceService: BinanceService) {}

  public async getMarketAnalysis(symbol: string | undefined, startDate: Date, endDate: Date): Promise<MarketAnalysis> {
    this.checkIfDatesAreCorrect(startDate, endDate)

    if (!symbol) {
      throw new BadRequestException('Symbol was not provided')
    }

    const trades = await this.binanceService.fetchRecentTrades(startDate, endDate, symbol)

    if (trades.length === 0) {
      return { symbol, priceAbsoluteChange: null, pricePercentageChange: null }
    }

    const { percentageChange, absoluteChange } = this.calculatePriceAnalysis(trades)

    return {
      symbol,
      priceAbsoluteChange: parseFloat(absoluteChange.toFixed(6)),
      pricePercentageChange: parseFloat(percentageChange.toFixed(6))
    }
  }

  private calculatePriceAnalysis(trades: TradeDTO[]): PriceAnalysis {
    const averagePrice = mean(trades.map(trade => trade.price))
    const currentPrice = trades.sort((a, b) => b.time.getTime() - a.time.getTime())[0].price

    return {
      absoluteChange: currentPrice - averagePrice,
      percentageChange: ((currentPrice - averagePrice) / currentPrice) * 100
    }
  }

  private checkIfDatesAreCorrect(startDate: Date, endDate: Date) {
    if (startDate.getTime() > endDate.getTime()) {
      throw new BadRequestException('Start date is after end date')
    }
  }
}
