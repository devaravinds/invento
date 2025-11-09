import * as dotenv from "dotenv";

dotenv.config({quiet: true});
const { env } = process;

export const DATABASE_URL: string = env.DATABASE_URL || "mongodb://invento-db:27017/invento";
export const SUPER_ADMIN_SECRET_KEY: string = env.SUPER_ADMIN_SECRET_KEY || "SuperSecret";
export const PORT: number = parseInt(env.PORT) || 8080;
