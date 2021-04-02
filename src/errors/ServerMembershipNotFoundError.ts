import BaseError from "./BaseError";
import {
  reacts
} from "../config.json";

export default class ServerMembershipNotFoundError extends BaseError {
  constructor(message = "❓ Server membership not found.") {
    super(message);
    this.message = message;
    this.name = "ServerMembershipNotFoundError";
    this.emoji = reacts.notFound;
  }
}