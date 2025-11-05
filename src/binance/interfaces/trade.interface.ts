interface TradeBase {
  id: number
  isByuerMaker: boolean
  isBestMatch: boolean
}

export interface TradeResponse extends TradeBase {
  price: string
  qty: string
  quoteQty: string
  time: number
}

export interface TradeDTO extends TradeBase {
  price: number
  qty: number
  quoteQty: number
  time: Date
}
