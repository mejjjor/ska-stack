import { createCookieSessionStorage } from "@remix-run/node";
import invariant from "tiny-invariant";

import { env } from "~/utils/env.server";

export const setSessionStorage = ({
  maxAge,
}: {
  maxAge: number | undefined;
}) => {
  invariant(process.env.COOKIE_SECRET, "COOKIE_SECRET must be set");
  sessionStorage = createCookieSessionStorage({
    cookie: {
      name: "_session",
      sameSite: "lax",
      path: "/",
      httpOnly: true,
      maxAge,
      secrets: [process.env.COOKIE_SECRET],
      secure: env.NODE_ENV === "production",
    },
  });
  return sessionStorage;
};

let sessionStorage: ReturnType<typeof createCookieSessionStorage> =
  setSessionStorage({
    maxAge: undefined,
  });

export const getSessionStorage = () => sessionStorage;
