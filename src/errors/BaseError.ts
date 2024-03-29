export default class BaseError extends Error {
  emoji: string;
  name: string;
  message: string;
  displayMessage = "Sorry, something went wrong while processing this command!";
}
