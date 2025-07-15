import * as dotenv from "dotenv";

dotenv.config({quiet: true});
const { env } = process;

export const DATABASE_URL: string = env.DATABASE_URL || "mongodb://127.0.0.1:27017/invento";