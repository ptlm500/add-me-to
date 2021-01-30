import { Entity, ManyToOne, JoinColumn } from 'typeorm';
import Server from "./Server";
import BaseRole from "./BaseRole";

@Entity()
export default class AdminRole extends BaseRole {

  @ManyToOne(() => Server, server => server.adminRoles, { onDelete: 'CASCADE' })
  @JoinColumn({ name: "serverId" })
  server: Server;

}
