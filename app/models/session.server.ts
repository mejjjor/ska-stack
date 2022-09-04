import type { Session } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Session } from "@prisma/client";

export async function getSessionByToken(token: Session["token"]) {
  return prisma.session.findUnique({
    where: { token },
  });
}
