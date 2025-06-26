import { Hono } from "hono";

import { getUsagesOverview, getUsagesByServer, updateUsage, getUsages } from "../controllers/usage.js";
import { authMiddleware } from "../middlewares/auth.js";

const usageRoutes = new Hono()

usageRoutes.use(authMiddleware)

usageRoutes
  .get("/all/:type", getUsages)
  .get("/overview/:type", getUsagesOverview)
  .get("/server/:serverId/:type", getUsagesByServer)
  .post("/", updateUsage)

export default usageRoutes
