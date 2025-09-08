import process from "node:process";

export const env = {
  NODE_ENV: process.env.NODE_ENV || "development",

  NODEMAILER_HOST: process.env.NODEMAILER_HOST!,
  NODEMAILER_PORT: Number(process.env.NODEMAILER_PORT),
  NODEMAILER_USER: process.env.NODEMAILER_USER,
  NODEMAILER_PASS: process.env.NODEMAILER_PASS,
};
