import { Injectable } from '@nestjs/common'
import { BinanceService } from 'src/binance/services/binance.service'

@Injectable()
export class TradingService {
  constructor(private readonly binanceService: BinanceService) {}
}
