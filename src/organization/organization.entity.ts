import { Base } from "src/base/base.entity";
import { Outlet } from "src/outlet/outlet.entity";
import { Partner } from "src/person/partner.entity";
import { Product } from "src/product/product.entity";
import { Role } from "src/user/role.entity";
import { Column, Entity, OneToMany } from "typeorm";

@Entity('organization')
export class Organization extends Base {
    @Column()
    name: string;
    @Column({ unique: true })
    phone: string;
    @OneToMany(() => Role, role => role.organization, { cascade: true })
    roles: Role[];
    @OneToMany(() => Outlet, outlet => outlet.organization, { cascade: true })
    outlets: Outlet[];
    @OneToMany(() => Partner, partner => partner.organization, { cascade: true })
    partners: Partner[];
    @OneToMany(() => Product, product => product.organization, { cascade: true })
    products: Product[];
}