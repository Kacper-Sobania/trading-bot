import { TradeDTO, TradeResponse } from '../interfaces/trade.interface'

export class TradeMapper {
  public static fromResponsesToDTOs(responses: TradeResponse[]): TradeDTO[] {
    return responses.map(this.fromResponseToDTO)
  }

  private static fromResponseToDTO(response: TradeResponse): TradeDTO {
    return {
      id: response.id,
      isBestMatch: response.isBestMatch,
      isByuerMaker: response.isByuerMaker,
      time: new Date(response.time),
      price: parseFloat(response.price),
      qty: parseFloat(response.qty),
      quoteQty: parseFloat(response.quoteQty)
    }
  }
}
