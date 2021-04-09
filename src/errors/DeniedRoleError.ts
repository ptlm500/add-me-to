import BaseError from "./BaseError";
import {
  reacts
} from "../config.json";

export default class DeniedRoleError extends BaseError {
  constructor(message: string) {
    super(message);
    this.message = message;
    this.name = "DeniedRoleError";
    this.emoji = reacts.notAllowed;
  }
}