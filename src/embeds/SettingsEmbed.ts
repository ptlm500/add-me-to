import { APIEmbedField } from "discord.js";
import { Role } from "../entities";
import AddMeToEmbed from "./AddMeToEmbed";
import { generateRoleList } from './utils';

const generateSettingsEmbed = (adminRoles: Role[]) => AddMeToEmbed
  .setColor(0x0099ff)
  .setTitle('⚙ Settings')
  .addFields([generateAdminRolesField(adminRoles)]);

export default generateSettingsEmbed;

const  generateAdminRolesField = (adminRoles: Role[]): APIEmbedField => {
  const noRolesText = 'ℹ️ No admin roles set. Add one or more with "add admin roles".';
  let fieldText = '_Users with these roles can manage the bot_\n\n';

  fieldText += adminRoles.length ? generateRoleList(adminRoles) : noRolesText;

  return {
    name: 'Admin roles:',
    value: fieldText
  };
}
