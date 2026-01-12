import jwt, { TokenExpiredError } from "jsonwebtoken";
// import { AppError } from "../errors/AppError";

const secret = process.env.JWT_SECRET;

interface IPayload {}

export const genToken = (payload: IPayload) => {};

export const verifyToken = (token: string) => {
  try {
    return; // data;
  } catch (error) {
    // throws new AppError(ERROR_MESSAGE.INVALID_TOKEN, STATUS_CODE.UNAUTHORIZED);
  }
};
