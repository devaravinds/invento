import { DecimalQuantity } from "src/inventory/inventory.dto";
import { UnitResponseDto } from "src/unit/unit.dto";

export class TransactionServiceHelper {
    static convertToTopLevelUnit(quantity: DecimalQuantity, parentTree: UnitResponseDto[]): DecimalQuantity {
            for(const unit of parentTree) {
                if(unit.parent) {
                    quantity.count = quantity.count.dividedBy(unit.conversionFactor);
                    quantity.unit = unit.parent;
                }
            }
            return quantity;
    } 
}