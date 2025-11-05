export interface MarketAnalysis {
  symbol: string
  priceAbsoluteChange: number | null
  pricePercentageChange: number | null
}

export interface PriceAnalysis {
  absoluteChange: number
  percentageChange: number
}
