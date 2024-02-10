import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CustomResponse } from "src/submodules/entities/src/constants/customResponse";
import { CartDto } from "src/submodules/entities/src/dto/cart.dto";
import { CartDocument } from "src/submodules/entities/src/schema/cart.schema";

@Injectable()
export class CartService {
    constructor(
        // @InjectModel('CartSchema') private cartModel: Model<CartDocument>,
    ){}

    async createCart(payload: CartDto) {
        try {

        } catch (error) {
            console.log(error);
            return new CustomResponse(500, 'Internal server error', error);
        }
    }
}