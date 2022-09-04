import { Authenticator } from "remix-auth";
import { FormStrategy } from "remix-auth-form";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

import { prisma } from "app/services/prisma.server";
import {
  getSessionStorage,
  setSessionStorage,
} from "~/services/session.server";
import { env } from "~/utils/env.server";
import { getSessionByToken } from "~/models/session.server";

export type TokenData = {
  userId: string;
  email: string;
  token: string;
};

type LoginForm = {
  email: string;
  password: string;
  rememberMe: boolean;
};

let authenticator = new Authenticator<TokenData>(getSessionStorage());

const getFormStrategy = () =>
  new FormStrategy(async ({ form }) => {
    const email = form.get("email");
    const password = form.get("password");
    const rememberMe = Boolean(form.get("rememberMe"));

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      typeof rememberMe !== "boolean"
    ) {
      throw new Error("'Form not submitted correctly.'");
    }

    const user = await login({ email, password, rememberMe });
    return user;
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

export async function login({ email, password, rememberMe }: LoginForm) {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
    include: {
      password: true,
    },
  });

  if (!user) {
    throw new Error("BAD");
  }

  const isCorrectPassword = await bcrypt.compare(
    password,
    user.password?.hash ?? ""
  );
  if (!isCorrectPassword) {
    throw new Error("BAD");
  }

  const token = uuidv4();
  const expire = new Date();
  expire.setSeconds(expire.getSeconds() + env.SESSION_MAX_AGE);
  const session = await prisma.session.create({
    data: {
      token,
      userId: user.id,
      expireAt: rememberMe ? undefined : expire,
    },
  });

  return { userId: user.id, email: user.email, token: session.token };
}

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
