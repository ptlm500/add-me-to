import { GuildMember, Message } from "discord.js";
import { getCustomRepository } from "typeorm";
import BaseError from "../errors/BaseError";
import UserPermissionsError from "../errors/UserPermissionsError";
import {
  reacts
} from "../config.json";
import ServerRepository from "../repositories/ServerRepository";
import logger from "../logger/logger";
import userHasAdminRole from "../utils/userHasAdminRole";

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

  async userIsAdminOnServer(user: GuildMember | null, serverId: string): Promise<boolean> {
    if (user?.permissions.has("ADMINISTRATOR")) {
      return true;
    }

    const serverRepository = getCustomRepository(ServerRepository);
    const adminRoles = await serverRepository.getAdminRolesByServer(serverId);
    if (user && adminRoles) {
      return userHasAdminRole(user, adminRoles) ? true : false;
    }

    return false;
  }

  async run(userMessage: Message): Promise<void> {
    if (userMessage && userMessage.guild) {
      try {
        const member = userMessage.member;

        if (!this.requiresAdmin || await this.userIsAdminOnServer(member, userMessage.guild.id)) {
          const success = await this.onRun(userMessage);

          success && this.onSuccess(userMessage);
        } else {
          throw new UserPermissionsError(`🔒 ${member?.displayName}:${member?.id} doesn't have permissions to ${this.name}.`);
        }
      } catch (e) {
        this.onError(e, userMessage);
      }
    }
  }
}