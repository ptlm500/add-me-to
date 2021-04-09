import { Role } from "../../entities";

export function generateRoleList(roles: Role[]): string {
  let roleString = '>>> ';

  roles.forEach(role => {
    roleString += `<@&${role.discordId}>\tAdded: ${role.updatedAt.toDateString()}\n`;
  })

  return roleString;
}
