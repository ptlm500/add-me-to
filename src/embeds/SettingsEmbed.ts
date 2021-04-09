import { EmbedFieldData, MessageEmbedOptions } from "discord.js";
import { Role } from "../entities";
import AddMeToEmbed from "./AddMeToEmbed";
import { generateRoleList } from './utils';

export default class SettingsEmbed extends AddMeToEmbed {
  constructor(adminRoles: Role[]) {
    const options : MessageEmbedOptions = {
      color: 0x0099ff,
      title: '⚙ Settings',
      fields: [generateAdminRolesField(adminRoles)]
    };

    super(options);
  }
}

function generateAdminRolesField(adminRoles: Role[]): EmbedFieldData {
  const noRolesText = 'ℹ️ No admin roles set. Add one or more with "add admin roles".';
  let fieldText = '_Users with these roles can manage the bot_\n\n';

  fieldText += adminRoles.length ? generateRoleList(adminRoles) : noRolesText;

  return {
    name: 'Admin roles:',
    value: fieldText
  };
}
