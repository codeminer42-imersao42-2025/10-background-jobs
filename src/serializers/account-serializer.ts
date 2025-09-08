import type { Account } from "../models/account.ts";

export const accountSerializer = {
  serialize(account: Account) {
    return {
      id: account.id,
      name: account.name,
      email: account.email,
      createdAt: new Date(account.createdAt).toISOString(),
      updatedAt: new Date(account.updatedAt).toISOString(),
    };
  },
};
