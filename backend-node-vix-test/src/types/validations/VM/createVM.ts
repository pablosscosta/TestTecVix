import { z } from "zod";
import { EVMStatus, ETaskLocation } from "@prisma/client";

// Password validation regex
export const passwordRegex = {
  numbers: /(?=.*\d.*\d)/,
  lowercase: /(?=.*[a-z].*[a-z])/,
  uppercase: /(?=.*[A-Z].*[A-Z])/,
  special:
    /(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?].*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])/,
};

export const vMCreatedSchema = z.object({
  vmName: z.string().optional(),
  vCPU: z.number().min(1, "vCPU must be at least 1"),
  ram: z.number().min(1, "RAM must be at least 1 GB"),
  disk: z.number().min(20, "Disk must be at least 20 GBs"),
  hasBackup: z.boolean().optional().default(false),
  idBrandMaster: z.number().nullable().optional(),
  status: z.nativeEnum(EVMStatus).optional(),
  location: z.nativeEnum(ETaskLocation).optional(),
  os: z.string().optional(),
  pass: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(passwordRegex.numbers, "Password must contain at least 2 numbers")
    .regex(
      passwordRegex.lowercase,
      "Password must contain at least 2 lowercase letters"
    )
    .regex(
      passwordRegex.uppercase,
      "Password must contain at least 2 uppercase letters"
    )
    .regex(
      passwordRegex.special,
      "Password must contain at least 2 special characters"
    )
    .optional(),
});

export type TVMCreate = z.infer<typeof vMCreatedSchema>;
