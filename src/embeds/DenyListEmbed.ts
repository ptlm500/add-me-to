import { EmbedFieldData, MessageEmbedOptions } from "discord.js";
import { Role } from "../entities";
import AddMeToEmbed from "./AddMeToEmbed";
import { generateRoleList } from './utils';

export default class DenyListEmbed extends AddMeToEmbed {
  constructor(deniedRoles: Role[]) {
    const options : MessageEmbedOptions = {
      color: 0x0099ff,
      title: '👮 Denied roles',
      fields: [generateDeniedRolesField(deniedRoles)]
    }

    super(options);
  }
}

function generateDeniedRolesField(deniedRoles: Role[]): EmbedFieldData {
  const noRolesText = 'ℹ️ No denied roles set. Add one or more with "deny @<role>".';
  let fieldText = '_You can\'t @add me to these roles_\n\n';

  fieldText += deniedRoles.length ? generateRoleList(deniedRoles) : noRolesText;

  return {
    name: 'Denied roles:',
    value: fieldText
  };
}
