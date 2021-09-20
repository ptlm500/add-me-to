import { CommandInteraction } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import BaseError from "../errors/BaseError";
import logger from "../logger/logger";

interface ISlashCommand {
  readonly slashCommandBuilder: Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
  onInteract(interaction: CommandInteraction): Promise<string>
  onSuccess(interaction: CommandInteraction, successMessage: string): void;
  onError(error: BaseError|Error, interaction: CommandInteraction): void;
  canExecute(interaction: CommandInteraction): boolean;
}

export default class SlashCommand implements ISlashCommand {
  readonly slashCommandBuilder: Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;

  onInteract(_interaction: CommandInteraction): Promise<string> {
    throw new Error("No onInteract method defined");
  }

  onSuccess(interaction: CommandInteraction, successMessage: string): void {
    interaction.reply(successMessage);
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
    interaction.reply('❗ Sorry, something went wrong while processing this command!');
  }

  async interact(interaction: CommandInteraction): Promise<void> {
    if (interaction && interaction.guild) {
      try {
        const successMessage = await this.onInteract(interaction);

        successMessage && this.onSuccess(interaction, successMessage);
      } catch (e) {
        this.onError(e, interaction);
      }
    }
  }
}
