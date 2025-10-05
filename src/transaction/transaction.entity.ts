import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { TransactionStatus, TransactionType } from "./transaction.enum";
import { Partner } from "src/person/partner.entity";
import { Outlet } from "src/outlet/outlet.entity";

@Entity('transaction')
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'float', nullable: false })
  rate: number;

  @Column({ type: 'varchar', nullable: false })
  productId: string;

  @ManyToOne(() => Partner, partner => partner.transactions)
  partner: Partner;

  @ManyToOne(() => Outlet, outlet => outlet.transactions)
  outlet: Outlet;

  @Column({ type: 'int', nullable: false })
  count: number;

  @Column({ type: 'enum', enum: TransactionStatus, nullable: false })
  transactionStatus: TransactionStatus;

  @Column({ type: 'enum', enum: TransactionType, nullable: false })
  transactionType: TransactionType;
}
