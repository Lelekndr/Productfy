import dotenv from 'dotenv';


dotenv.config({quiet: true});

function getRequiredEnv(key: string): string {
  const value = process.env[key];
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}



export const ENV ={
    PORT: getRequiredEnv("PORT"),
    DATABASE_URL: getRequiredEnv("DATABASE_URL"),
    NODE_ENV: getRequiredEnv("NODE_ENV"),
    FRONTEND_URL: getRequiredEnv("FRONTEND_URL"),
    CLERK_PUBLISHABLE_KEY: getRequiredEnv("CLERK_PUBLISHABLE_KEY"),
    CLERK_SECRET_KEY: getRequiredEnv("CLERK_SECRET_KEY"),
}