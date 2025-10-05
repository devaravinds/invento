import { Base } from "src/base/base.entity";
import { InventoryItem } from "src/inventory-item/inventory-item.entity";
import { Organization } from "src/organization/organization.entity";
import { Column, Entity, ManyToMany, ManyToOne, OneToMany } from "typeorm";

@Entity('product')
export class Product extends Base {
    @Column()
    name: string;
    @Column()
    description: string;
    @OneToMany(() => InventoryItem, inventoryItem => inventoryItem.product, { cascade: true })
    inventoryItem: InventoryItem;
    @ManyToOne(() => Organization, organization => organization.products, { eager: true })
    organization: Organization;
}