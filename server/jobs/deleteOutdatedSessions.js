import { prisma } from "~/db.server";

export async function deleteOutdatedSessions(job) {
  console.log("cron deleteOutdatedSessions");
  const sessions = await prisma.session.deleteMany({
    where: { expireAt: { lt: new Date() } },
  });
  console.log("delete sessions", sessions);
}
