import { EmbedFieldData, MessageEmbed, MessageEmbedOptions } from "discord.js";
import { Role } from "src/entities";

export default class SettingsEmbed extends MessageEmbed {
  constructor(adminRoles: Role[]) {

    const options : MessageEmbedOptions = {
      color: 0x0099ff,
      title: 'Admin roles'
    };

    const roleFields = adminRoles.map(generateAdminRoleFields);

    options.fields = roleFields;

    super(options);
  }
}

function generateAdminRoleFields(adminRole: Role) : EmbedFieldData {
  return {
    name: `id: ${adminRole.discordId}`,
    value: `<@&${adminRole.discordId}>\nAdded: ${adminRole.updatedAt}`
  };
}
