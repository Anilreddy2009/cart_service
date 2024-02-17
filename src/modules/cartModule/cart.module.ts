import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { CartSchema } from "src/submodules/entities/src/schema/cart.schema";
import { CartService } from "./cart.service";
import { CartController } from "./cart.controller";

@Module({
    imports: [
        MongooseModule.forFeature([
            {name: 'CartSchema', schema: CartSchema},
        ])
    ],
    controllers: [CartController],
    providers: [CartService]
})
export class CartModule{}