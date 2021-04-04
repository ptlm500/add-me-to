import BaseError from "./BaseError";
import {
  reacts
} from "../config.json";

export default class InvalidCommandError extends BaseError {
  constructor(message: string) {
    super(message);
    this.message = message;
    this.name = "InvalidCommandError";
    this.emoji = reacts.invalidCommand;
  }
}