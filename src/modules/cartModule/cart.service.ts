import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CustomResponse } from "src/submodules/entities/src/constants/customResponse";
import { CartDto, RemoveItemFromCartDto } from "src/submodules/entities/src/dto/cart.dto";
import { CartDocument } from "src/submodules/entities/src/schema/cart.schema";

@Injectable()
export class CartService {
    constructor(
        @InjectModel('CartSchema') private cartModel: Model<CartDocument>,
    ){}

    private logger = new Logger(CartService.name);

    async createCart(userId: string) {
        try {
            this.logger.debug(`creating a cart`);
            const userCart: CartDto =  {
                userId,
                items: []
            }
            const newCart = new this.cartModel(userCart)
            await newCart.save();
            this.logger.debug(`cart creation is successfull`)
            return new CustomResponse(200, 'cart creation is successfull', userId);
        } catch (error) {
            console.log(error);
            return new CustomResponse(500, 'Internal server error', error);
        }
    }

    async addItemToCart(payload: CartDto) {
        try {
            this.logger.debug(`adding item to cart with userId: ${payload?.userId}`)
            const cart: CartDto = await this.cartModel.findOne({userId: payload?.userId});
            if(cart) {
                // const index = cart?.items.findIndex(item => item.productId == payload?.items[0].productId);
                cart?.items.push(payload?.items[0]);
                return new CustomResponse(200, 'Item added to cart', null);
            }
            return new CustomResponse(404, 'Cart not found', payload)
        } catch (error) {
            console.log(error);
            return new CustomResponse(500, 'Internal server error', error);
        }
    }

    async updateCart(payload: CartDto) {
        try {
            this.logger.debug(`adding item to cart with userId: ${payload?.userId}`)
            const cart: CartDto = await this.cartModel.findOne({userId: payload?.userId});
            if(cart) {
                const index = cart?.items.findIndex(item => item.productId == payload?.items[0].productId);
                if(index != -1) {
                    cart.items[index] = payload?.items[0];
                } else {
                    cart?.items.push(payload?.items[0]);
                }
                await this.cartModel.updateOne({userId: payload?.userId}, payload);
                return new CustomResponse(200, 'Item added to cart', null);
            }
            return new CustomResponse(404, 'Cart not found', payload)
        } catch(error) {
            console.log(error);
            return new CustomResponse(500, 'Internal server error', error);
        }
    }

    async removeItemFromCart(payload: RemoveItemFromCartDto) {
        try {
            this.logger.debug(`deleting an item from cart`);
            const cart: CartDto = await this.cartModel.findOne({userId: payload?.userId});
            if(cart) {
                const index = cart?.items.findIndex(item => item.productId == payload?.productId);
                if(index != -1) {
                    this.logger.debug(`Item found proceeding for removing the item`)
                    cart.items.splice(index,1);
                    await this.cartModel.updateOne({userId: payload?.userId}, {cartItems: cart.items});
                    return new CustomResponse(200, 'Item added to cart', null);
                }
                return new CustomResponse(404, 'Item not found in cart', payload)
            }
            return new CustomResponse(404, 'Cart not found', payload)
        } catch (error) {
            console.log(error);
            return new CustomResponse(500, 'Internal server error', error);
        }
    }

    async getUserCart(userId: string) {
        try {
            this.logger.debug(`fetch user cart with userId: ${userId}`);
            const cart: CartDto = await this.cartModel.findOne({userId});
            if(cart) {
                this.logger.debug(`cart found for userId: ${userId}`)
                return new CustomResponse(200, 'fetching cart successfull', cart);
            }else {
                this.logger.debug(`cart not found for userId: ${userId}, proceeding for creation`)
                return await this.createCart(userId);
            }
        } catch (error) {
            console.log(error);
            return new CustomResponse(500, 'Internal server error', error);
        }
    }
}