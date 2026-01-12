import { Router } from "express";
import { brandMasterRoutes } from "./brandMaster.routes";
import { vMRoutes } from "./vM.routes";
import { uploadsRoutes } from "./uploads.routes";
import { usersRoutes } from "./users.routes";
import { authRoutes } from "./auth.routes";

export const routes = Router();

routes.use(uploadsRoutes);
routes.use(brandMasterRoutes);
routes.use(vMRoutes);
routes.use(usersRoutes);
routes.use(authRoutes);