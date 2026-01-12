export class AppError {
  #_message: string;
  #_status: number;

  constructor(message: string, status: number) {
    this.#_message = message;
    this.#_status = status;
  }

  get message() {
    return this.#_message;
  }

  get status() {
    return this.#_status;
  }
}
