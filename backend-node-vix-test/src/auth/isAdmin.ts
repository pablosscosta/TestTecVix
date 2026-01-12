import { NextFunction, Response } from "express";
import { CustomRequest } from "../types/custom";
import { AppError } from "../errors/AppError";
import { ERROR_MESSAGE } from "../constants/erroMessages";
import { STATUS_CODE } from "../constants/statusCode";
import { user } from "@prisma/client";

export const isAdmin = (
  req: CustomRequest<unknown>,
  _res: Response,
  next: NextFunction,
) => {
  const user = req.user as user;
  if (user.role !== "admin") {
    throw new AppError(ERROR_MESSAGE.UNAUTHORIZED, STATUS_CODE.UNAUTHORIZED);
  }
  return next();
};
