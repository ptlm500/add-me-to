
import { APIEmbedField } from "discord.js";
import { Role } from "../entities";
import generateEmbed from "./generateEmbed";
import { generateRoleList } from './utils';


const generateDenyListEmbed = (deniedRoles: Role[]) => generateEmbed()
  .setColor(0x0099ff)
  .setTitle('👮 Denied roles')
  .addFields([generateDeniedRolesField(deniedRoles)]);

export default generateDenyListEmbed;

export const generateDeniedRolesField = (deniedRoles: Role[]) : APIEmbedField  => {
  const noRolesText = 'ℹ️ No denied roles set. Add one or more with "/deny <role>".';
  let fieldText = '_Users can\'t add these roles_\n\n';

  fieldText += deniedRoles.length ? generateRoleList(deniedRoles) : noRolesText;

  return {
    name: 'Denied roles:',
    value: fieldText
  };
}
