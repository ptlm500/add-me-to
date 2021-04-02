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
  // TODO add test to ensure command names and aliases are unique
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
    throw new Error("No run method defined")
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
        const serverMembership = userMessage.member;

        if (!serverMembership) {
          throw new ServerMembershipNotFoundError();
        }
        const user = new User(serverMembership)

        if (!this.requiresAdmin || await user.canAdministerRoles(userMessage.guild.id)) {
          const success = await this.onRun(userMessage);

          success && this.onSuccess(userMessage);
        } else {
          throw new UserPermissionsError(`🔒 ${serverMembership.displayName}:${serverMembership.id} doesn't have permissions to ${this.name}.`);
        }
      } catch (e) {
        this.onError(e, userMessage);
      }
    }
  }
}