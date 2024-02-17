import { Body, Controller, Delete, Get, Logger, Post, Put } from "@nestjs/common";
import { CartService } from "./cart.service";
import { CustomResponse } from "src/submodules/entities/src/constants/customResponse";
import { CartDto, RemoveItemFromCartDto } from "src/submodules/entities/src/dto/cart.dto";
import { EventPattern } from "@nestjs/microservices";
import { rmqEvents } from "src/submodules/entities/src/enum/rmqEvents";

@Controller('cart')
export class CartController {
    constructor(
        private cartService: CartService,
    ){}

    private logger = new Logger(CartController.name);

    @Post('create-cart')
    @EventPattern(rmqEvents.CREATE_CART)
    async createCart(@Body() body) {
        try {
            this.logger.debug(`cart creation triggered for userId: ${body?.userId}`)
            return await this.cartService.createCart(body?.userId);
        } catch (error) {
            console.log(error);
            return new CustomResponse(500, 'Internal server error', error);
        }
    }

    @Get('user-cart')
    async getUserCart(@Body() body) {
        try {
            this.logger.debug(`fetch user cart`)
            return await this.cartService.getUserCart(body?.userId);
        } catch (error) {
            console.log(error);
            return new CustomResponse(500, 'Internal server error', error);
        }
    }

    @Put(`update-cart`)
    async updateCart(@Body() body: CartDto) {
        try {
            this.logger.debug(`update user cart`)
            return await this.cartService.updateCart(body);
        } catch (error) {
            console.log(error);
            return new CustomResponse(500, 'Internal server error', error);
        }
    }

    @Post(`add-to-cart`)
    async addToCart(@Body() body: CartDto) {
        try {
            this.logger.debug(`add to cart`)
            return await this.cartService.addItemToCart(body);
        } catch (error) {
            console.log(error);
            return new CustomResponse(500, 'Internal server error', error);
        }
    }

    @Delete(`remove-item`)
    async removeItemFromCart(@Body() body: RemoveItemFromCartDto) {
        try {
            this.logger.debug(`remove item from user cart`)
            return await this.cartService.removeItemFromCart(body);
        } catch (error) {
            console.log(error);
            return new CustomResponse(500, 'Internal server error', error);
        }
    }
}