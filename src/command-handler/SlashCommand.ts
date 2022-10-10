import { BaseMessageOptions, CommandInteraction, GuildMember } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import BaseError from "../errors/BaseError";
import logger from "../logger/logger";
import User from "../user/User";
import UserPermissionsError from "../errors/UserPermissionsError";
import { buildInteraction, Interaction } from "./interaction/interaction";

export type InteractionResponse = Pick<BaseMessageOptions, "content" | "components" | "embeds">;

interface ISlashCommand {
  readonly slashCommandBuilder: Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
  onInteract(interaction: Interaction): Promise<InteractionResponse>
  onSuccess(interaction: Interaction, response: InteractionResponse): void;
  onError(error: BaseError|Error, interaction: CommandInteraction): void;
  canExecute(interaction: CommandInteraction): boolean;
}

export default class SlashCommand implements ISlashCommand {
  readonly slashCommandBuilder: Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
  readonly ephemeral: boolean;
  readonly requiresAdmin: boolean;

  onInteract(_interaction: Interaction): Promise<InteractionResponse> {
    throw new Error("No onInteract method defined");
  }

  onSuccess(interaction: Interaction, response: InteractionResponse): void {
    interaction.command.reply({ ...response, ephemeral: this.ephemeral });
  }

  canExecute(interaction: CommandInteraction): boolean {
    return this.slashCommandBuilder.name === interaction.commandName;
  }

  onError(error: BaseError, command: CommandInteraction): void {
    logger.warning(error.message, {
      meta: {
        serverId: command.guild?.id,
      },
      name: error.name,
      stackTrace: error.stack,
      command
    });
    command.reply({ content: `${error.emoji} ${error.displayMessage}`, ephemeral: true });
  }

  async interact(command: CommandInteraction): Promise<void> {
    try {
      const interaction = await buildInteraction(command);
      await this.checkPermissions(interaction.guild.id, interaction.command.member as GuildMember);
      const response = await this.onInteract(interaction);

      response && this.onSuccess(interaction, response);
    } catch (e) {
      this.onError(e, command);
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
