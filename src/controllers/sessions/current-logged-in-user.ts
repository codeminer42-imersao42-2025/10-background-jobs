import type { RouteHandler } from "fastify";
import { Account } from "../../models/account.ts";
import { accountSerializer } from "../../serializers/account-serializer.ts";

export const currentLoggedInUserHandler: RouteHandler = async (
  request,
  reply
) => {
  const account = await Account.query().findById(request.user.sub);

  return reply
    .status(200)
    .send({ account: accountSerializer.serialize(account!) });
};
