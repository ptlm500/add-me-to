import BaseError from "./BaseError";
import {
  reacts
} from "../config.json";

export default class DenyedRoleError extends BaseError {
  constructor(message: string) {
    super(message);
    this.message = message;
    this.name = "DenyedRoleError";
    this.emoji = reacts.notAllowed;
  }
}