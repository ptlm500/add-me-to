import { BaseMessageOptions, CommandInteraction, GuildMember } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import BaseError from "../errors/BaseError";
import logger from "../logger/logger";
import User from "../user/User";
import UserPermissionsError from "../errors/UserPermissionsError";

export type InteractionResponse = Pick<BaseMessageOptions, "content" | "components" | "embeds">;
interface ISlashCommand {
  readonly slashCommandBuilder: Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
  onInteract(interaction: CommandInteraction): Promise<InteractionResponse>
  onSuccess(interaction: CommandInteraction, response: InteractionResponse): void;
  onError(error: BaseError|Error, interaction: CommandInteraction): void;
  canExecute(interaction: CommandInteraction): boolean;
}

export default class SlashCommand implements ISlashCommand {
  readonly slashCommandBuilder: Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
  readonly ephemeral: boolean;
  readonly requiresAdmin: boolean;

  onInteract(_interaction: CommandInteraction): Promise<InteractionResponse> {
    throw new Error("No onInteract method defined");
  }

  onSuccess(interaction: CommandInteraction, response: InteractionResponse): void {
    interaction.reply({ ...response, ephemeral: this.ephemeral });
  }

  canExecute(interaction: CommandInteraction): boolean {
    return this.slashCommandBuilder.name === interaction.commandName;
  }

  onError(error: BaseError, interaction: CommandInteraction): void {
    logger.warning(error.message, {
      meta: {
        serverId: interaction.guild?.id,
      },
      name: error.name,
      stackTrace: error.stack,
      interaction
    });
    interaction.reply({ content: `${error.emoji} ${error.displayMessage}`, ephemeral: true });
  }

  async interact(interaction: CommandInteraction): Promise<void> {
    if (interaction && interaction.guild && interaction.member) {
      try {
        await this.checkPermissions(interaction.guild.id, interaction.member as GuildMember);
        const response = await this.onInteract(interaction);

        response && this.onSuccess(interaction, response);
      } catch (e) {
        this.onError(e, interaction);
      }
    }
  }

  private async checkPermissions(serverId: string, member: GuildMember) {
    if (this.requiresAdmin) {
      const user = User.fromGuildMember(member);
      const canAdminister = await user.canAdministerRoles(serverId);
      if (!canAdminister) {
        throw new UserPermissionsError(`🔒 ${member.user.username}:${serverId} doesn't have permissions.`);
      }
    }
  }
}
