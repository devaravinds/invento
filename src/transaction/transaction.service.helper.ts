import { QuantityDto } from "src/inventory-item/inventory-item.dto";
import { UnitResponseDto } from "src/unit/unit.dto";

export class TransactionServiceHelper {
    static convertToTopLevelUnit(quantity: QuantityDto, parentTree: UnitResponseDto[]): QuantityDto {
            for(const unit of parentTree) {
                quantity.count = quantity.count/unit.conversionFactor
                quantity.unit = unit.parent;
            }
            return quantity;
    } 
}