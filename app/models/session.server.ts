import type { Session, User } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Session } from "@prisma/client";

export async function getSessionByToken(token: Session["token"]) {
  return prisma.session.findUnique({
    where: { token },
  });
}

export async function getSessionsByUserId(id: User["id"]) {
  return prisma.session.findMany({
    where: { userId: id },
  });
}

export async function createSession(
  token: Session["token"],
  userId: User["id"],
  expireAt: Session["expireAt"]
) {
  return prisma.session.create({
    data: {
      token,
      userId,
      expireAt,
    },
  });
}

export async function deleteSession(token: Session["token"]) {
  return prisma.session.delete({
    where: {
      token,
    },
  });
}
