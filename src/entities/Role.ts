import { Entity, ManyToOne, JoinColumn } from 'typeorm';
import Server from "./Server";
import BaseRole from "./BaseRole";

@Entity()
export default class Role extends BaseRole {

  @ManyToOne(() => Server, server => server.denyList, { onDelete: 'CASCADE' })
  @JoinColumn({ name: "serverId" })
  server: Server;

}
