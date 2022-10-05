import BaseError from "./BaseError";
import {
  reacts
} from "../config.json";

export default class UserPermissionsError extends BaseError {
  constructor(message: string) {
    super(message);
    this.message = message;
    this.name = "UserPermissionsError";
    this.emoji = reacts.notAllowed;
    this.displayMessage = "You're not allowed to do that.";
  }
}