import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, BaseEntity, JoinColumn } from 'typeorm';
import Server from "./Server";

@Entity()
export default class Role extends BaseEntity {

  @PrimaryGeneratedColumn()
  id!: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  serverId: number;
  @ManyToOne(() => Server, server => server.denyList)
  @JoinColumn({ name: "serverId" })
  server: Server;

  @Column({ unique: true })
  discordId!: string;
}
