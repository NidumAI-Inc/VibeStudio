import { Hono } from "hono";

import { getGoogleUrl, googleCallback } from "../controllers/google.js";

const googleRoutes = new Hono().basePath("/google")

googleRoutes.get("/", getGoogleUrl)
googleRoutes.get("/callback", googleCallback)

export default googleRoutes
