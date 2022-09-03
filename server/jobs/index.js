import { deleteOutdatedSessions } from "./deleteOutdatedSessions";
import PgBoss from "pg-boss";

async function init() {
  const boss = new PgBoss(process.env.POSTGRESQL_ADDON_URI);

  boss.on("error", (error) => console.error(error));

  await boss.start();

  await boss.work("deleteOutdatedSessions", deleteOutdatedSessions);

  await boss.schedule("deleteOutdatedSessions", "* * * * *");
}

export default { init };
