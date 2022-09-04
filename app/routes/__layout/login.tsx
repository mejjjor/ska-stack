import * as React from "react";
import type { ActionArgs, LoaderArgs, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { verifyLogin } from "~/models/user.server";
import { validateEmail } from "~/utils";
import {
  TextInput,
  PasswordInput,
  Checkbox,
  Paper,
  Title,
  Container,
  Group,
  Button,
  Input,
} from "@mantine/core";

import {
  getAuthenticator,
  isAuthenticated,
  setAuthenticator,
} from "~/services/auth.server";
import links from "~/utils/links";
import { env } from "~/utils/env.server";

export async function loader({ request }: LoaderArgs) {
  const tokenData = await isAuthenticated(request);
  if (tokenData) {
    return redirect("/");
  }
  return json({});
}

type ActionData = { errors: { email?: string; password?: string } };

export async function action({ request }: ActionArgs) {
  const formData = await request.clone().formData();
  const email = formData.get("email");
  const password = formData.get("password");
  // const redirectTo = safeRedirect(formData.get("redirectTo"), "/");
  const remember = formData.get("remember");

  if (!validateEmail(email)) {
    return json(
      { errors: { email: "Email is invalid", password: null } },
      { status: 400 }
    );
  }

  if (typeof password !== "string" || password.length === 0) {
    return json(
      { errors: { password: "Password is required", email: null } },
      { status: 400 }
    );
  }

  if (password.length < 8) {
    return json(
      { errors: { password: "Password is too short", email: null } },
      { status: 400 }
    );
  }

  const user = await verifyLogin(email, password);

  if (!user) {
    return json(
      { errors: { email: "Invalid email or password", password: null } },
      { status: 400 }
    );
  }
  setAuthenticator({ maxAge: remember ? undefined : env.SESSION_MAX_AGE });
  return await getAuthenticator().authenticate("user-pass", request, {
    successRedirect: links.profile,
    failureRedirect: links.home,
  });
}

export const meta: MetaFunction = () => {
  return {
    title: "Sign In",
  };
};

export default function Join() {
  const actionData = useActionData<ActionData>();
  const emailRef = React.useRef<HTMLInputElement>(null);
  const passwordRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (actionData?.errors?.email) {
      emailRef.current?.focus();
    } else if (actionData?.errors?.password) {
      passwordRef.current?.focus();
    }
  }, [actionData]);

  return (
    <Container size={420} my={40}>
      <Title
        align="center"
        sx={(theme) => ({
          fontFamily: `Greycliff CF, ${theme.fontFamily}`,
          fontWeight: 900,
        })}
      >
        Welcome back !
      </Title>
      <Form method="post" autoComplete="off">
        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <TextInput
            ref={emailRef}
            label="Email"
            placeholder="you@mantine.dev"
            autoComplete="off"
            autoFocus={true}
            name="email"
            aria-invalid={actionData?.errors?.email ? true : undefined}
            aria-label="email field"
            aria-describedby="email-error"
            required
          />
          {actionData?.errors?.email && (
            <Input.Error mt="xs" id="email-error">
              {actionData?.errors?.email}
            </Input.Error>
          )}
          <PasswordInput
            ref={passwordRef}
            label="Password"
            placeholder="Your password"
            name="password"
            aria-invalid={actionData?.errors?.password ? true : undefined}
            aria-label="password field"
            aria-describedby="password-error"
            mt="md"
            required
          />
          {actionData?.errors?.password && (
            <Input.Error mt="xs" id="password-error">
              {actionData?.errors?.password}
            </Input.Error>
          )}
          <Group position="apart" mt="md">
            <Checkbox name="remember" label="remember me" />
          </Group>
          <Button type="submit" fullWidth mt="xl">
            Login
          </Button>
        </Paper>
      </Form>
    </Container>
  );
}
