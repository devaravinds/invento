import * as dotenv from "dotenv";

dotenv.config({quiet: true});
const { env } = process;

export const DATABASE_URL: string = env.DATABASE_URL || "mongodb://invento-db:27017/invento";