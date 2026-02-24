import { IsEnum } from "class-validator";
import { OrderStatus, OrderStatusList } from "../enum/order.enum";

export class StatusDto {
    @IsEnum(OrderStatusList, {
        message: `Invalid status, possible values are ${OrderStatusList}`
    })
    status: OrderStatus;
}
