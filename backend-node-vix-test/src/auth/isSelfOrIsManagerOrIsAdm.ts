import { NextFunction, Response } from "express";
import { CustomRequest } from "../types/custom";
import { AppError } from "../errors/AppError";
import { ERROR_MESSAGE } from "../constants/erroMessages";
import { STATUS_CODE } from "../constants/statusCode";
import { user } from "@prisma/client";

export const isSelfOrIsManagerOrIsAdm = (
  req: CustomRequest<user>,
  _res: Response,
  next: NextFunction,
) => {
  const user = req.user as user;
  const idUserFromParams = req.params.idUser; // UUID é string

  // Admin ou Manager sempre passam
  if (user.role === "admin" || user.role === "manager") {
    return next();
  }

  // Member só passa se for o próprio id
  if (user.role === "member") {
    if (user.idUser === idUserFromParams) {
      return next();
    }
    throw new AppError(ERROR_MESSAGE.FORBIDDEN, STATUS_CODE.FORBIDDEN);
  }

  throw new AppError(ERROR_MESSAGE.UNAUTHORIZED, STATUS_CODE.UNAUTHORIZED);
};
