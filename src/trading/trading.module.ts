import { Module } from '@nestjs/common'
import { BinanceModule } from 'src/binance/binance.module'
import { TradingService } from './services/trading.service'
import { TradingController } from './controllers/trading.controller'

@Module({
  imports: [BinanceModule],
  controllers: [TradingController],
  providers: [TradingService]
})
export class TradingModule {}
