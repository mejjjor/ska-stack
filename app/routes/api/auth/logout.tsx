import { redirect } from "@remix-run/node";

import { getAuthenticator, isAuthenticated } from "~/services/auth.server";
import links from "~/utils/links";
import { prisma } from "~/services/prisma.server";

import type { ActionFunction } from "@remix-run/node";

export const action: ActionFunction = async ({ request }) => {
  const user = await isAuthenticated(request);
  if (user) {
    await prisma.session.delete({
      where: {
        token: user.token,
      },
    });
    return await getAuthenticator().logout(request, { redirectTo: links.home });
  } else {
    return redirect(request.url);
  }
};
