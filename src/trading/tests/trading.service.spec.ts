import { Test, TestingModule } from '@nestjs/testing'
import { TradingService } from '../services/trading.service'
import { BinanceModule } from '../../binance/binance.module'
import { BinanceService } from '../../binance/services/binance.service'
import { TradingModule } from '../trading.module'
import dayjs from 'dayjs'

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
    const defaultStartDate = dayjs().subtract(3, 'day').toDate()
    const defaultEndDate = dayjs().subtract(1, 'day').toDate()
    const defaultSymbol = 'BTCUSDT'
    it('should throw error when symbol not provided', async () => {
      expect(tradingService.getMarketAnalysis(undefined, defaultStartDate, defaultEndDate)).rejects.toThrow(
        'Symbol was not provided'
      )
    })

    it('should throw error when start date is after end date', async () => {
      const startDate = dayjs().subtract(1, 'day').toDate()
      const endDate = dayjs().subtract(3, 'day').toDate()

      expect(tradingService.getMarketAnalysis(defaultSymbol, startDate, endDate)).rejects.toThrow(
        'Start date is after end date'
      )
    })

    it('should return nulls when no trades available', async () => {
      binanceService.fetchRecentTrades = jest.fn().mockResolvedValueOnce([])

      const result = await tradingService.getMarketAnalysis(defaultSymbol, defaultStartDate, defaultEndDate)

      expect(result).toEqual({
        symbol: defaultSymbol,
        priceAbsoluteChange: null,
        pricePercentageChange: null
      })
    })
  })
})
