import * as dotenv from 'dotenv';
dotenv.config();
const { env } = process;

export const JwtConfig = {
  secretKeyAccessToken: env.JWT_ACCESS_TOKEN_SECRET_KEY || 'secret_key',
  algorithm: 'HS256',
  ttlAccessToken: env.ACCESS_TOKEN_TTL || '7d',
};
