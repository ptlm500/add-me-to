import { APIEmbedField } from "discord.js";
import { Role } from "../entities";
import AddMeToEmbed from "./AddMeToEmbed";
import { generateDeniedRolesField } from "./DenyListEmbed";
import { generateRoleList } from './utils';

const generateSettingsEmbed = (adminRoles: Role[] | null,  deniedRoles: Role[]) => AddMeToEmbed
  .setColor(0x0099ff)
  .setTitle('⚙ Settings')
  .addFields([generateAdminRolesField(adminRoles), generateDeniedRolesField(deniedRoles)])

export default generateSettingsEmbed;

const  generateAdminRolesField = (adminRoles: Role[] | null): APIEmbedField => {
  let fieldText = '_Users with these roles can manage the bot_\n\n';

  if (!adminRoles || adminRoles.length === 0) {
    fieldText += 'ℹ️ No admin roles set. Add one or more with "\\addadmin roles".';
  } else {
    fieldText += generateRoleList(adminRoles);
  }

  return {
    name: 'Admin roles:',
    value: fieldText
  };
}
