import { Message } from "discord.js";
import Command from "./Command";

export default class CommandHandler {
  private registeredCommands: ICommandDictionary<Command>;
  private defaultCommand: Command;

  constructor(commands: Command[], defaultCommand: Command) {
    this.defaultCommand = defaultCommand;
    this.registeredCommands = {};
    commands.forEach(command => {
      this.registeredCommands[command.name] = command;

      command.aliases?.forEach(commandAlias => {
        this.registeredCommands[commandAlias] = command;
      });
    });
  }

  onMessage(command: string, userMessage: Message) {
    const handler = this.registeredCommands[command] || this.defaultCommand;

    if (handler) {
      handler.run(userMessage);
    }
  }
}

interface ICommandDictionary<Command> {
  [id: string]: Command;
}
