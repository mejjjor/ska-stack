import { Authenticator } from "remix-auth";
import { FormStrategy } from "remix-auth-form";
import { v4 as uuidv4 } from "uuid";
import {
  getSessionStorage,
  setSessionStorage,
} from "~/services/session.server";
import { env } from "~/utils/env.server";
import { createSession, getSessionByToken } from "~/models/session.server";
import { verifyLogin } from "~/models/user.server";

export type TokenData = {
  userId: string;
  email: string;
  token: string;
};

let authenticator = new Authenticator<TokenData>(getSessionStorage());

const getFormStrategy = () =>
  new FormStrategy(async ({ form }) => {
    const email = form.get("email");
    const password = form.get("password");
    const remember = Boolean(form.get("remember"));

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      typeof remember !== "boolean"
    ) {
      throw new Error("'Form not submitted correctly.'");
    }

    const user = await verifyLogin(email, password);

    if (!user) {
      throw new Error("BAD");
    }

    const expireAt = new Date();
    expireAt.setSeconds(expireAt.getSeconds() + env.SESSION_MAX_AGE);

    const session = await createSession(
      uuidv4(),
      user.id,
      remember ? null : expireAt
    );

    return { userId: user.id, email: user.email, token: session.token };
  });

authenticator.use(getFormStrategy(), "user-pass");

export const getAuthenticator = () => authenticator;
export const setAuthenticator = ({
  maxAge,
}: {
  maxAge: number | undefined;
}) => {
  authenticator = new Authenticator<TokenData>(setSessionStorage({ maxAge }));

  authenticator.use(getFormStrategy(), "user-pass");
  return authenticator;
};

export const isAuthenticated = async (request: Request) => {
  const user = await getAuthenticator().isAuthenticated(request.clone());
  if (user) {
    const session = await getSessionByToken(user.token);
    if (session) {
      return user;
    } else {
      await getAuthenticator().logout(request, { redirectTo: request.url });
    }
  }
  return null;
};
