export interface TradeResponse {
  a: number
  f: number
  l: number
  m: boolean
  M: boolean
  p: string
  q: string
  T: number
}

export interface TradeDTO {
  tradeId: number
  price: number
  quantity: number
  firstTradeId: number
  lastTradeId: number
  isByuerMaker: boolean
  isBestMatch: boolean
  time: Date
}
