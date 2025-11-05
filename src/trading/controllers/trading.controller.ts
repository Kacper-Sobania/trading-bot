import { Controller, Get, HttpCode, HttpStatus, ParseDatePipe, Query } from '@nestjs/common'
import { TradingService } from '../services/trading.service'
import { MarketAnalysis } from '../dtos/market-analysis.dto'

@Controller('trading')
export class TradingController {
  constructor(private readonly tradingService: TradingService) {}

  @HttpCode(HttpStatus.OK)
  @Get('market-analysis')
  async getMarketAnalysis(
    @Query('startDate', new ParseDatePipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST })) startDate: Date,
    @Query('endDate', new ParseDatePipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST })) endDate,
    @Query('symbol') symbol: string
  ): Promise<MarketAnalysis> {
    return this.tradingService
  }
}
