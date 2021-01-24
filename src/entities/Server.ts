import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, BaseEntity } from 'typeorm';
import Role from "./Role";

@Entity()
export default class Server extends BaseEntity {

  @PrimaryGeneratedColumn()
  id!: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ unique: true })
  discordId!: string;

  @Column()
  name: string;

  @OneToMany(() => Role, role => role.server, { onDelete: 'CASCADE' })
  denyList: Role[];

}
