import { EmbedFieldData, MessageEmbed, MessageEmbedOptions } from "discord.js";
import { Role } from "../entities";

export default class DenyListEmbed extends MessageEmbed {
  constructor(deniedRoles: Role[]) {
    const options : MessageEmbedOptions = {
      color: 0x0099ff,
      title: 'Denyed roles',
      fields: deniedRoles.map(generateDeniedRoleFields)
    }

    super(options);
  }
}

function generateDeniedRoleFields(deniedRole: Role) : EmbedFieldData {
  return {
    name: `id: ${deniedRole.discordId}`,
    value: `<@&${deniedRole.discordId}>\nAdded: ${deniedRole.updatedAt}`
  }
}
