import { Google } from "arctic";
import 'dotenv/config';

const clientId = process.env.GOOGLE_CLIENT_ID || ""
const clientSecret = process.env.GOOGLE_CLIENT_SECRET || ""
const redirectURI = process.env.GOOGLE_REDIECT_URI || ""

const google = new Google(clientId, clientSecret, redirectURI)

export default google