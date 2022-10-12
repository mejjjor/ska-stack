import { createCookieSessionStorage } from "@remix-run/node"; // or cloudflare/deno

export const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    // a Cookie from `createCookie` or the same CookieOptions to create one
    cookie: {
      name: "csrf",
      secrets: ["r3m1xr0ck5"],
      sameSite: "lax",
    },
  });
