import { Response } from "express";
import { CustomRequest } from "../types/custom";
import { STATUS_CODE } from "../constants/statusCode";
import { prisma } from "../database/client";
import { userCreatedSchema } from "../types/validations/User/createUser";
import bcrypt from "bcryptjs";
import { genToken } from "../utils/jwt"; 
import { AppError } from "../errors/AppError";

export class AuthController {
  constructor() {}

  // ========= REGISTER =========
  async register(req: CustomRequest<unknown>, res: Response) {
    try {
      const data = userCreatedSchema.parse(req.body);
      const hashedPassword = await bcrypt.hash(data.password, 10);

      const user = await prisma.user.create({
        data: {
          username: data.username,
          email: data.email,
          password: hashedPassword,
          role: data.role || "member",
        },
      });

      return res.status(STATUS_CODE.CREATED).json({
        idUser: user.idUser,
        username: user.username,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
      });
    } catch (err: any) {
      if (err.code === "P2002" && err.meta?.target?.includes("email")) {
        return res.status(STATUS_CODE.CONFLICT).json({ message: "Email já cadastrado" });
      }
      return res.status(STATUS_CODE.BAD_REQUEST).json({ message: "Erro ao registrar usuário" });
    }
  }


  // ========= LOGIN =========
  async login(req: CustomRequest<unknown>, res: Response) {
    try {
      const { email, password } = req.body as { email: string; password: string };

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return res.status(STATUS_CODE.UNAUTHORIZED).json({ message: "Credenciais inválidas" });
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(STATUS_CODE.UNAUTHORIZED).json({ message: "Credenciais inválidas" });
      }

      const token = genToken({
        idUser: user.idUser,
        email: user.email,
        role: user.role,
      });


      return res.status(STATUS_CODE.OK).json({
        token,
        user: {
          idUser: user.idUser,
          username: user.username,
          email: user.email,
          role: user.role,
          isActive: user.isActive,
        },
      });
    } catch (err) {
      return res.status(STATUS_CODE.BAD_REQUEST).json({ message: "Erro ao realizar login", error: err });
    }
  }
}
