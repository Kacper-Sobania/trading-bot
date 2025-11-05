import { Test, TestingModule } from '@nestjs/testing'
import { TradingService } from '../services/trading.service'
import { BinanceModule } from '../../binance/binance.module'
import { BinanceService } from '../../binance/services/binance.service'
import { TradingModule } from '../trading.module'
import dayjs from 'dayjs'
import { TradeDTO } from 'src/binance/interfaces/trade.interface'
import { TradeMockFactory } from './mocks/trade.mocks'

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

    it('should calculate price change when increase', async () => {
      const now = Date.now()
      binanceService.fetchRecentTrades = jest
        .fn()
        .mockResolvedValueOnce([
          TradeMockFactory.getTrade({ price: 100, time: new Date(now - 1) }),
          TradeMockFactory.getTrade({ price: 200, time: new Date(now) })
        ])

      const result = await tradingService.getMarketAnalysis(defaultSymbol, defaultStartDate, defaultEndDate)

      expect(result).toEqual({
        symbol: defaultSymbol,
        priceAbsoluteChange: 50,
        pricePercentageChange: 33.333333
      })
    })

    it('should calculate price change when decrease', async () => {
      const now = Date.now()
      binanceService.fetchRecentTrades = jest
        .fn()
        .mockResolvedValueOnce([
          TradeMockFactory.getTrade({ price: 200, time: new Date(now - 1) }),
          TradeMockFactory.getTrade({ price: 100, time: new Date(now) })
        ])

      const result = await tradingService.getMarketAnalysis(defaultSymbol, defaultStartDate, defaultEndDate)

      expect(result).toEqual({
        symbol: defaultSymbol,
        priceAbsoluteChange: -50,
        pricePercentageChange: -33.333333
      })
    })

    //More tests should be added to verify logic but not enough time to deliver that
  })
})
