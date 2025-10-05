import { Base } from "src/base/base.entity";
import { Outlet } from "src/outlet/outlet.entity";
import { Product } from "src/product/product.entity";
import { Column, Entity, ManyToMany, ManyToOne } from "typeorm";

@Entity('inventory_item')
export class InventoryItem extends Base{
    @ManyToOne(() => Product, product => product.inventoryItem)
    product: Product;
    @ManyToOne(() => Outlet, outlet => outlet.inventoryItems)
    outlet: Outlet;
    @Column()
    quantity: number;
}