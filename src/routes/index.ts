import { Router } from "express";

import { productsRoutes } from "./products-routes";
import { tableRoutes } from "./tables-routes";
import { tablesSessionsRoutes } from "./tables-sessions-routes";

const routes = Router();
routes.use("/products", productsRoutes);
routes.use("/tables", tableRoutes);
routes.use("/tables-sessions", tablesSessionsRoutes);

export { routes };