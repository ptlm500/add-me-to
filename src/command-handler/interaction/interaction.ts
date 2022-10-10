import { CommandInteraction, Guild, GuildMember, Role } from "discord.js";
import BaseError from "../../errors/BaseError";
import InvalidCommandError from "../../errors/InvalidCommandError";

export type Interaction = {
  guildId: string;
  guild: Guild;
  member: GuildMember;
  commandName: string;
  command: CommandInteraction;
};

export const buildInteraction = async (command: CommandInteraction): Promise<Interaction> => {
  if (!command.member) {
    throw new InvalidCommandError("🤷 Interact has no associated member");
  }
  if (!command.guild) {
    throw new InvalidCommandError("🤷 Interact has no associated guild");
  }

  return {
    guildId: command.guild.id,
    guild: command.guild,
    member: command.member as GuildMember,
    commandName: command.commandName,
    command
  }
}
export const getRoleOption = async (interaction: Interaction): Promise<Role> => {
  const roleOption = interaction.command.options.get('role')?.role;

  if (!roleOption) {
    throw new InvalidCommandError("🤷 No role option set");
  }

  const guildRole = await interaction.guild.roles.fetch(roleOption.id);
  if (!guildRole) {
    throw new BaseError(`🤷 couldn't get role ${roleOption.id}`);
  }

  return guildRole;
}
