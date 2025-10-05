import { Base } from "src/base/base.entity";
import { Organization } from "src/organization/organization.entity";
import { Transaction } from "src/transaction/transaction.entity";
import { Entity, Column, ManyToMany, OneToMany, ManyToOne } from "typeorm";

@Entity('partner')
export class Partner extends Base {

  @Column({ nullable: false })
  name: string;

  @Column({ unique: true, nullable: false })
  phone: string;

  @ManyToOne(() => Organization, organization => organization.partners)
  organization: Organization;
  
  @OneToMany(() => Transaction, transaction => transaction.partner, { cascade: true })
  transactions: Transaction[];
}
