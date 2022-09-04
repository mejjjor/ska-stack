import { json, redirect } from "@remix-run/node";

import { isAuthenticated } from "~/services/auth.server";
import { prisma } from "~/services/prisma.server";

import type { ActionFunction } from "@remix-run/node";

export const action: ActionFunction = async ({ request }) => {
  const user = await isAuthenticated(request);
  if (user) {
    const token = (await request.formData()).get("token");
    if (typeof token !== "string") {
      return redirect(request.url);
    }
    await prisma.session.delete({
      where: {
        token,
      },
    });
  }
  return json({ ok: true });
};
