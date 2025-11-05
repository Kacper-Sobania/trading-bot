import { TradeDTO, TradeResponse } from '../interfaces/trade.interface'

export class TradeMapper {
  public static fromResponsesToDTOs(responses: TradeResponse[]): TradeDTO[] {
    return responses.map(this.fromResponseToDTO)
  }

  private static fromResponseToDTO(response: TradeResponse): TradeDTO {
    return {
      tradeId: response.a,
      isBestMatch: response.M,
      isByuerMaker: response.m,
      time: new Date(response.T),
      price: parseFloat(response.p),
      quantity: parseFloat(response.q),
      firstTradeId: response.f,
      lastTradeId: response.l
    }
  }
}
