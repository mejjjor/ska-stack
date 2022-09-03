import { PrismaClient } from "@prisma/client";
import invariant from "tiny-invariant";

let prisma: PrismaClient;

declare global {
  var __db__: PrismaClient;
}

if (!global.__db__) {
  global.__db__ = getClient();
}
prisma = global.__db__;

function getClient() {
  const { POSTGRESQL_ADDON_URI } = process.env;
  invariant(
    typeof POSTGRESQL_ADDON_URI === "string",
    "POSTGRESQL_ADDON_URI env var not set"
  );

  const databaseUrl = new URL(POSTGRESQL_ADDON_URI);

  console.log(`🔌 setting up prisma client to ${databaseUrl.host}`);
  // NOTE: during development if you change anything in this function, remember
  // that this only runs once per server restart and won't automatically be
  // re-run per request like everything else is. So if you need to change
  // something in this file, you'll need to manually restart the server.
  const client = new PrismaClient({
    datasources: {
      db: {
        url: databaseUrl.toString(),
      },
    },
  });
  // connect eagerly
  client.$connect();

  return client;
}

export { prisma };
