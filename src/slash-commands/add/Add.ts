import { Collection, CommandInteraction } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import SlashCommand from "../../command-handler/SlashCommand";
import { addRoles } from "../../controllers/roleManagementController";
import InvalidCommandError from "../../errors/InvalidCommandError";
import BaseError from "../../errors/BaseError";
import DeniedRoleError from "../../errors/DeniedRoleError";

const ROLE_OPTION = 'role';
export default class Add extends SlashCommand {
  readonly slashCommandBuilder = new SlashCommandBuilder()
    .setName('add')
    .setDescription('Adds you to a role')
    .addRoleOption(option =>
      option.setName(ROLE_OPTION)
        .setDescription('The role to be added to')
        .setRequired(true));

  async onInteract(interaction: CommandInteraction): Promise<string> {
    const roleOption = interaction.options.getRole(ROLE_OPTION);

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

    await addRoles(member, new Collection([[guildRole.name, guildRole]]));
    return `✅ added <@${member.id}> to <@&${guildRole.id}>`;
  }

  onError(error: BaseError, interaction: CommandInteraction) : void {
    if (error instanceof DeniedRoleError ) {
      interaction.reply('👮 That role is on the deny list!');
      return;
    }
    return super.onError(error, interaction);
  }
}
