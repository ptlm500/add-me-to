import { SlashCommandBuilder } from "@discordjs/builders";
import { Collection } from "discord.js";
import { allowRoles } from "../../services/serverManagementService";
import SlashCommand, { InteractionResponse } from "../../command-handler/SlashCommand";
import { Interaction, getRoleOption } from "../../command-handler/interaction/interaction";

const ROLE_OPTION = 'role';
export default class Allow extends SlashCommand {
  ephemeral = true;
  requiresAdmin = true;
  readonly slashCommandBuilder = new SlashCommandBuilder()
    .setName('allow')
    .setDescription('Removes a role from the deny list')
    .addRoleOption(option =>
      option.setName(ROLE_OPTION)
        .setDescription('The role to prevent users from adding to themselves')
        .setRequired(true));

  async onInteract(interaction: Interaction): Promise<InteractionResponse> {
    const role = await getRoleOption(interaction);

    await allowRoles(interaction.guildId, new Collection([[role.name, role]]));
    return { content: `✅ users can no longer add themselves to <@&${role.id}> using the bot` };
  }
}
