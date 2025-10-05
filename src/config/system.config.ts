import * as dotenv from "dotenv";

dotenv.config({quiet: true});
const { env } = process;

export const DATABASE_URL: string = env.DATABASE_URL || "mongodb://invento-db:27017/invento";
export const POSTGRES_PORT: number = parseInt(env.POSTGRES_PORT) || 5432;
export const POSTGRES_PASSWORD: string = env.POSTGRES_PASSWORD || "password";
export const POSTGRES_USERNAME: string = env.POSTGRES_USERNAME || "postgres"
export const POSTGRES_DATABASE: string = env.POSTGRES_DATABASE || "invento";

export const SUPER_ADMIN_SECRET_KEY: string = env.SUPER_ADMIN_SECRET_KEY || "superadminsecretkey";