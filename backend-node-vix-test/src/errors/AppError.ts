export class AppError extends Error {
  #_status: number;

  constructor(message: string, status: number) {
    super(message);
    this.#_status = status;

    Object.setPrototypeOf(this, AppError.prototype);
  }

  get status() {
    return this.#_status;
  }
}
