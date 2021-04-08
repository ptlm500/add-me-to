import { Message } from "discord.js";
import BaseError from "../errors/BaseError";
import UserPermissionsError from "../errors/UserPermissionsError";
import ServerMembershipNotFoundError from "../errors/ServerMembershipNotFoundError";
import {
  reacts
} from "../config.json";
import logger from "../logger/logger";
import User from "../user/User";

interface ICommand {
  readonly name: string;
  readonly aliases: string[];
  requiresAdmin: boolean;
  onRun(userMessage: Message): Promise<boolean>;
  onSuccess(userMessage: Message): void;
  onError(error: BaseError|Error, userMessage: Message): void;
}

export default class Command implements ICommand {
  readonly name: string;
  readonly aliases: string[];
  requiresAdmin = false;
  onRun(_userMessage: Message): Promise<boolean> {
    throw new Error("No run method defined");
  }

  onSuccess(userMessage: Message): void {
    userMessage.react(reacts.done);
  }

  onError(error: BaseError, userMessage: Message): void {
    logger.warning(error.message, {
      meta: {
        serverId: userMessage.guild?.id,
      },
      name: error.name,
      userMessage
    });
    userMessage.react(error.emoji);
  }

  async run(userMessage: Message): Promise<void> {
    if (userMessage && userMessage.guild) {
      try {
        const guildMember = userMessage.member;

        if (!guildMember) {
          throw new ServerMembershipNotFoundError();
        }
        const user = User.fromGuildMember(guildMember);

        if (!this.requiresAdmin || await user.canAdministerRoles(userMessage.guild.id)) {
          const success = await this.onRun(userMessage);

          success && this.onSuccess(userMessage);
        } else {
          throw new UserPermissionsError(`🔒 ${guildMember.displayName}:${guildMember.id} doesn't have permissions to ${this.name}.`);
        }
      } catch (e) {
        this.onError(e, userMessage);
      }
    }
  }
}