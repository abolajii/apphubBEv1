import dotenv from "dotenv";

dotenv.config();

export const dbConfig = {
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  dialect: "mysql" as const,
  logging: process.env.NODE_ENV === "development" ? console.log : false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};

export const authConfig = {
  jwtSecret:
    process.env.JWT_SECRET ||
    "your-super-secret-jwt-key-change-this-in-production",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
};

export const emailConfig = {
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT ? parseInt(process.env.EMAIL_PORT) : undefined,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  from: process.env.FROM_EMAIL,
};

export const serverConfig = {
  port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
  nodeEnv: process.env.NODE_ENV,
  isDevelopment: process.env.NODE_ENV === "development",
  isProduction: process.env.NODE_ENV === "production",
};

export const apiConfig = {
  prodUrl: process.env.API_LOG,
  testUrl: process.env.TEST_ENV,
  baseUrl:
    process.env.NODE_ENV === "production"
      ? process.env.API_LOG
      : process.env.TEST_ENV,
};

export const appConfig = {
  appId: process.env.APPID || "SYSTEM",
  appName: process.env.APPNAME || "Default Application",
};

export default {
  db: dbConfig,
  auth: authConfig,
  email: emailConfig,
  server: serverConfig,
  api: apiConfig,
  app: appConfig,
};
