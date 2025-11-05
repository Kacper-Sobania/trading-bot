import { Test, TestingModule } from '@nestjs/testing'
import { TradingService } from '../services/trading.service'
import { BinanceModule } from '../../binance/binance.module'
import { BinanceService } from '../../binance/services/binance.service'
import { TradingModule } from '../trading.module'

describe('TradingService', () => {
  let tradingService: TradingService
  let binanceService: BinanceService

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [BinanceModule, TradingModule],
      providers: [TradingService, BinanceService]
    }).compile()

    tradingService = moduleRef.get<TradingService>(TradingService)
    binanceService = moduleRef.get<BinanceService>(BinanceService)
  })

  describe('getMarketAnalysis', () => {
    it('should throw error when symbol not provided', async () => {
      const startDate = new Date()
      const endDate = new Date()
      expect(tradingService.getMarketAnalysis(undefined, startDate, endDate)).rejects.toThrow()
    })
  })
})
