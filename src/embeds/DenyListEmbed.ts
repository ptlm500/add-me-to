import { EmbedFieldData, MessageEmbed, MessageEmbedOptions } from "discord.js";
import { Role } from "../entities";

export default class DenyListEmbed extends MessageEmbed {
  constructor(denyedRoles: Role[]) {

    const options : MessageEmbedOptions = {
      color: 0x0099ff,
      title: 'Denyed roles'
    }

    const roleFields = denyedRoles.map(generateDenyedRoleFields);

    options.fields = roleFields;

    super(options);
  }
}

function generateDenyedRoleFields(denyedRole: Role) : EmbedFieldData {
  return {
    name: `id: ${denyedRole.discordId}`,
    value: `<@&${denyedRole.discordId}>\nAdded: ${denyedRole.updatedAt}`
  }
}
