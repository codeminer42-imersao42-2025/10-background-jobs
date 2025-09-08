import crypto from "node:crypto";

export const passwordEncrypter = {
  encrypt(password: string): `${string}.${string}` {
    const salt = crypto.randomBytes(16).toString("hex");
    const hash = crypto
      .pbkdf2Sync(password, salt, 100_000, 64, "sha512")
      .toString("hex");
    return `${salt}.${hash}`;
  },

  matches(password: string, encryptedPassword: `${string}.${string}`) {
    const [salt, hash] = encryptedPassword.split(".") as [string, string];
    const hashedPassword = crypto
      .pbkdf2Sync(password, salt, 100_000, 64, "sha512")
      .toString("hex");
    return hash === hashedPassword;
  },
};
