import { user } from "@prisma/client";
import { UserModel } from "../models/UserModel";
import { querySchema } from "../types/validations/Queries/queryListAll";
import { userCreatedSchema, TUserCreated } from "../types/validations/User/createUser";
import { userUpdatedSchema, TUserUpdated } from "../types/validations/User/updateUser";
import { prisma } from "../database/client";
import { AppError } from "../errors/AppError";
import { ERROR_MESSAGE } from "../constants/erroMessages";
import { STATUS_CODE } from "../constants/statusCode";

export class UserService {
  constructor() {}
  private userModel = new UserModel();

  async listAll(query: unknown) {
    const validQuery = querySchema.parse(query);
    return this.userModel.listAll(validQuery);
  }

  async getById(idUser: string) {
    const result = await this.userModel.getById(idUser);
    if (!result) {
      throw new AppError(ERROR_MESSAGE.USER_NOT_FOUND, STATUS_CODE.NOT_FOUND);
    }
    return result;
  }

  async createUser(data: TUserCreated, currentUser?: user) {
    const newUser = await prisma.user.create({
      data: {
        username: data.username,
        password: data.password,
        email: data.email,
        role: data.role ?? "member",
      },
    });

    return newUser;
  }

  async updateUser(idUser: string, data: unknown, currentUser: user) {
    const validData = userUpdatedSchema.parse(data);

    const oldUser = await this.userModel.getById(idUser);
    if (!oldUser) {
      throw new AppError(ERROR_MESSAGE.USER_NOT_FOUND, STATUS_CODE.NOT_FOUND);
    }

    const updatedUser = await this.userModel.updateUser(idUser, validData);
    return updatedUser;
  }


  async deleteUser(idUser: string, currentUser: user) {
    const oldUser = await this.userModel.getById(idUser);
    if (!oldUser) {
      throw new AppError(ERROR_MESSAGE.USER_NOT_FOUND, STATUS_CODE.NOT_FOUND);
    }

    const deletedUser = await this.userModel.deleteUser(idUser);
    return { user: deletedUser };
  }
}
