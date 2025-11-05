import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { TradingModule } from './trading/trading.module'

@Module({
  imports: [TradingModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
