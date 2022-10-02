import { Collection, CommandInteraction } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import SlashCommand from "../../command-handler/SlashCommand";
import { removeRoles } from "../../controllers/roleManagementController";
import InvalidCommandError from "../../errors/InvalidCommandError";
import BaseError from "../../errors/BaseError";
import DeniedRoleError from "../../errors/DeniedRoleError";

const ROLE_OPTION = 'role';
export default class Remove extends SlashCommand {
  readonly slashCommandBuilder = new SlashCommandBuilder()
    .setName('remove')
    .setDescription('Removes you from a role')
    .addRoleOption(option =>
      option.setName(ROLE_OPTION)
        .setDescription('The role to be removed from')
        .setRequired(true));

  async onInteract(interaction: CommandInteraction): Promise<string> {
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

    await removeRoles(member, new Collection([[guildRole.name, guildRole]]));
    return `✅ removed <@${member.id}> from <@&${guildRole.id}>`;
  }

  onError(error: BaseError, interaction: CommandInteraction) : void {
    if (error instanceof DeniedRoleError ) {
      interaction.reply('👮 That role is on the deny list!');
      return;
    }
    return super.onError(error, interaction);
  }
}
