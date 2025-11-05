import { TradeDTO } from '../../../binance/interfaces/trade.interface'

const defaultTrade: TradeDTO = {
  tradeId: 1,
  price: 1,
  quantity: 1,
  firstTradeId: 1,
  lastTradeId: 1,
  isByuerMaker: true,
  isBestMatch: true,
  time: new Date()
}

export class TradeMockFactory {
  public static getTrade(customProperties: Partial<TradeDTO> = {}): TradeDTO {
    return {
      ...defaultTrade,
      ...customProperties
    }
  }
}
