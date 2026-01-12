import jwt from "jsonwebtoken";
import { AppError } from "../errors/AppError";
import { STATUS_CODE } from "../constants/statusCode";

const secret = process.env.JWT_SECRET || "secret";

interface IPayload {
  idUser: string;
  email: string;
  role: string;
}

export const genToken = (payload: IPayload) => {
  const expiresIn: string | number = process.env.JWT_EXPIRES_IN || "1d";

  return jwt.sign(payload, secret, { expiresIn } as jwt.SignOptions);
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, secret) as IPayload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new AppError("Token expirado", STATUS_CODE.UNAUTHORIZED);
    }
    throw new AppError("Token inválido", STATUS_CODE.UNAUTHORIZED);
  }
};
