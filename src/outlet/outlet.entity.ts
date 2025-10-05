import { Base } from "src/base/base.entity";
import { InventoryItem } from "src/inventory-item/inventory-item.entity";
import { Organization } from "src/organization/organization.entity";
import { Transaction } from "src/transaction/transaction.entity";
import { Column, Entity, ManyToOne } from "typeorm";

@Entity('outlet')
export class Outlet extends Base {
    @Column()
    name: string;
    @Column()
    phone: string;
    @Column()
    address: string;
    @ManyToOne(() => Organization, organization => organization.outlets)
    organization: Organization; 
    @ManyToOne(() => Transaction, transaction => transaction.outlet, { cascade: true })
    transactions: Transaction[];
    @ManyToOne(() => InventoryItem, inventoryItem => inventoryItem.outlet, { cascade: true})
    inventoryItems: InventoryItem[];
}