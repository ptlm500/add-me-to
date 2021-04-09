import BaseError from "./BaseError";
import {
  reacts
} from "../config.json";

export default class DiscordApiError extends BaseError {
  constructor(error: Error) {
    super(error.message);
    this.message = error.message;
    this.name = "DiscordApiError";
    this.emoji = reacts.error;
  }
}
