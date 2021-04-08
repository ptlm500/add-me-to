import { EmbedFieldData, MessageEmbed, MessageEmbedOptions } from "discord.js";
import { Role } from "../entities";

export default class SettingsEmbed extends MessageEmbed {
  constructor(adminRoles: Role[]) {
    const options : MessageEmbedOptions = {
      color: 0x0099ff,
      title: 'Admin roles',
      fields: adminRoles.map(generateAdminRoleFields)
    };

    super(options);
  }
}

function generateAdminRoleFields(adminRole: Role) : EmbedFieldData {
  return {
    name: `id: ${adminRole.discordId}`,
    value: `<@&${adminRole.discordId}>\nAdded: ${adminRole.updatedAt}`
  };
}
