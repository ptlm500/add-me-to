import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, Collection } from "discord.js";
import { denyRoles } from "../../services/serverManagementService";
import SlashCommand, { InteractionResponse } from "../../command-handler/SlashCommand";
import InvalidCommandError from "../../errors/InvalidCommandError";
import BaseError from "../../errors/BaseError";

const ROLE_OPTION = 'role';
export default class Deny extends SlashCommand {
  ephemeral = true;
  requiresAdmin = true;
  readonly slashCommandBuilder = new SlashCommandBuilder()
    .setName('deny')
    .setDescription('Prevent users from adding themselves to a role')
    .addRoleOption(option =>
      option.setName(ROLE_OPTION)
        .setDescription('The role to prevent users from adding to themselves')
        .setRequired(true));

  async onInteract(interaction: CommandInteraction): Promise<InteractionResponse> {
    const roleOption = interaction.options.get(ROLE_OPTION)?.role;

    if (!interaction.member) {
      throw new InvalidCommandError("🤷 Interact has no associated member");
    }
    if (!roleOption) {
      throw new InvalidCommandError("🤷 No role option set");
    }

    const member = await interaction.guild?.members.fetch(interaction.member.user.id);
    const guildRole = await interaction.guild?.roles.fetch(roleOption.id);

    if (!member) {
      throw new BaseError(`🤷 couldn't get member ${interaction.member.user.id}`);
    }
    if (!guildRole) {
      throw new BaseError(`🤷 couldn't get role ${roleOption.id}`);
    }

    await denyRoles(interaction.guildId!, new Collection([[guildRole.name, guildRole]]));

    return { content: '✅' };
  }
}