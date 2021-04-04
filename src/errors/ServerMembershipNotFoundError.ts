import BaseError from "./BaseError";
import {
  reacts
} from "../config.json";

export default class ServerNotFoundError extends BaseError {
  constructor(message = "❓ Server not found.") {
    super(message);
    this.message = message;
    this.name = "ServerNotFoundError";
    this.emoji = reacts.notFound;
  }
}