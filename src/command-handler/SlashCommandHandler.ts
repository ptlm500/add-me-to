import { Routes } from 'discord-api-types/v9';
import { CommandInteraction } from "discord.js";
import rest from '../clients/discordRestClient';
import SlashCommand from './SlashCommand';
import logger from '../logger/logger';
import { PROD } from '../constants';

export default class SlashCommandHandler {
  private commands: SlashCommand[];
  constructor (commands: SlashCommand[]) {
    this.commands = commands;
  }

  async registerCommands(): Promise<void> {
    const body = this.commands.map(command => command.slashCommandBuilder.toJSON());

    if (!process.env.APP_ID) {
      const message = '❗ APP_ID not set';
      throw new Error(message);
    }

    try {
      let route: string;
      if (PROD) {
        logger.notice('⌛ Registering global slash commands');
        route = Routes.applicationCommands(process.env.APP_ID);
      } else {
        if (!process.env.GUILD_ID) {
          const message = '❗ GUILD_ID not set';
          throw new Error(message);
        }
        route = Routes.applicationGuildCommands(process.env.APP_ID, process.env.GUILD_ID);
        logger.notice(`⌛ Registering slash commands on guild ${process.env.GUILD_ID}`);

      }
      await rest.put(route as `/${string}`, { body });
      logger.notice('✅ Slash commands registered');
    } catch (e) {
      logger.error('❗ Unable to register slash commands', e);
    }
  }

  onInteract(interaction: CommandInteraction): void {
    this.commands.find(command => command.canExecute(interaction))?.interact(interaction);
  }
}
