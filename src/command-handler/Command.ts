import { GuildMember, Message } from "discord.js";
import BaseError from "../errors/BaseError";
import UserPermissionsError from "../errors/UserPermissionsError";
import {
  reacts
} from "../config.json";
import logger from "../logger/logger";

interface ICommand {
  readonly name: string;
  readonly aliases: string[];
  roleIds: string[];
  onRun(userMessage: Message): boolean;
  onSuccess(userMessage: Message): any;
  onError(error: any, userMessage: Message): any;
}

export default class Command implements ICommand {
  readonly name: string;
  readonly aliases: string[];
  roleIds: string[];
  onRun(_userMessage: Message): any { };

  onSuccess(userMessage: Message): any {
    userMessage.react(reacts.done);
  };

  onError(error: BaseError, userMessage: Message): any {
    logger.warning(error.message, {
      meta: {
        serverId: userMessage.guild?.id,
      },
      name: error.name,
      userMessage
    });
    userMessage.react(error.emoji);
  };

  userHasRequiredRole(user: GuildMember | null) {
    if (this.roleIds?.length) {
      return this.roleIds.find(
        roleId => user?.roles.cache.find(
          userRole => userRole.id === roleId
        )
      );
    }

    return true;
  }

  async run(userMessage: Message) {
    try {
      const member = userMessage.member;
      if (this.userHasRequiredRole(member)) {
        const success = await this.onRun(userMessage);

        success && this.onSuccess(userMessage);
      } else {
        throw new UserPermissionsError(`${member?.displayName}:${member?.id} doesn't have permissions to add roles.`);
      }
    } catch (e) {
      this.onError(e, userMessage);
    }
  }
}