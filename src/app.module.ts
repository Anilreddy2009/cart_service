import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CartModule } from './modules/cartModule/cart.module';
require("custom-env").env(true);
console.log(process.env.MONGO_HOST);
console.log(process.env.RBTMQ_HOST);


@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_HOST),
    CartModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
