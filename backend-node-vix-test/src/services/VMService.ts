import { user } from "@prisma/client";
import { VMModel } from "../models/VMModel";
import { vMCreatedSchema } from "../types/validations/VM/createVM";
import { AppError } from "../errors/AppError";
import { ERROR_MESSAGE } from "../constants/erroMessages";
import { STATUS_CODE } from "../constants/statusCode";
import { vMUpdatedSchema } from "../types/validations/VM/updateVM";
import { vmListAllSchema } from "../types/validations/VM/vmListAll";
import bcrypt from "bcryptjs";

export class VMService {
  private vMModel = new VMModel();

  async getById(idVM: number) {
    return this.vMModel.getById(idVM);
  }

  async listAll(query: unknown, user: user) {
    const validQuery = vmListAllSchema.parse(query);
    return this.vMModel.listAll({ query: validQuery });
  }

  async createNewVM(data: unknown, user: user) {
    const validateData = vMCreatedSchema.parse(data);

    // se vier senha, gera hash; senão deixa null
    let hashedPass: string | null = null;
    if (validateData.pass) {
      hashedPass = await bcrypt.hash(validateData.pass, 10);
    }

    const createdVM = await this.vMModel.createNewVM({
      ...validateData,
      pass: hashedPass ?? undefined,
      status: "RUNNING",
    });

    return createdVM;
  }

  async updateVM(idVM: number, data: unknown, user: user) {
    const validateDataSchema = vMUpdatedSchema.parse(data);
    const oldVM = await this.getById(idVM);

    if (!oldVM) {
      throw new AppError(ERROR_MESSAGE.NOT_FOUND, STATUS_CODE.NOT_FOUND);
    }

    // começa com a senha antiga (string | null)
    let hashedPass: string | null = oldVM.pass;
    if (validateDataSchema.pass) {
      hashedPass = await bcrypt.hash(validateDataSchema.pass, 10);
    }

    const updatedVM = await this.vMModel.updateVM(idVM, {
      ...validateDataSchema,
      pass: hashedPass ?? undefined,
    });

    return updatedVM;
  }


  async deleteVM(idVM: number, user: user) {
    const oldVM = await this.getById(idVM);
    if (!oldVM) {
      throw new AppError(ERROR_MESSAGE.NOT_FOUND, STATUS_CODE.NOT_FOUND);
    }
    return this.vMModel.deleteVM(idVM);
  }
}
