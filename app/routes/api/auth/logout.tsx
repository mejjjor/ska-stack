import { redirect } from "@remix-run/node";

import { getAuthenticator, isAuthenticated } from "~/services/auth.server";
import links from "~/utils/links";

import type { ActionFunction } from "@remix-run/node";
import { deleteSession } from "~/models/session.server";

export const action: ActionFunction = async ({ request }) => {
  const user = await isAuthenticated(request);
  console.log("user", user);
  if (user) {
    await deleteSession(user.token);
    return await getAuthenticator().logout(request, { redirectTo: links.home });
  } else {
    return redirect(links.home);
  }
};
