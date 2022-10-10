import { Collection, CommandInteraction } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import SlashCommand, { InteractionResponse } from "../../command-handler/SlashCommand";
import { removeRoles } from "../../controllers/roleManagementController";
import BaseError from "../../errors/BaseError";
import DeniedRoleError from "../../errors/DeniedRoleError";
import { Interaction, getRoleOption } from "../../command-handler/interaction/interaction";


const ROLE_OPTION = 'role';
export default class Remove extends SlashCommand {
  readonly slashCommandBuilder = new SlashCommandBuilder()
    .setName('remove')
    .setDescription('Removes you from a role')
    .addRoleOption(option =>
      option.setName(ROLE_OPTION)
        .setDescription('The role to be removed from')
        .setRequired(true));

  async onInteract(interaction: Interaction): Promise<InteractionResponse> {
    const role = await getRoleOption(interaction);
    const { member } = interaction;

    await removeRoles(member, new Collection([[role.name, role]]));
    return { content: `✅ removed <@${member.id}> from <@&${role.id}>` };
  }

  onError(error: BaseError, interaction: CommandInteraction) : void {
    if (error instanceof DeniedRoleError ) {
      interaction.reply('👮 That role is on the deny list!');
      return;
    }
    return super.onError(error, interaction);
  }
}
