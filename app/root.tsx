import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { MantineProvider } from "@mantine/core";
import { mantineCache } from "./mantineCache";
import { StylesPlaceholder } from "@mantine/remix";
import { generateHash } from "~/utils/misc";
import {
  AuthenticityTokenProvider,
  createAuthenticityToken,
} from "remix-utils";
import { getSession, commitSession } from "~/services/csrf.server";

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Remix boilerplate ska stack",
  description:
    "ska stack with remix, clevercloud, mantine, prisma and many more",
  viewport: "width=device-width,initial-scale=1",
});

const theme = {
  primaryColor: "violet",
};

export const loader: LoaderFunction = async ({ request }) => {
  let session = await getSession(request.headers.get("cookie"));
  let token = createAuthenticityToken(session);
  return json(
    {
      csrf: token,
      cspNonce: generateHash(42),
    },
    { headers: { "Set-Cookie": await commitSession(session) } }
  );
};

export default function App() {
  const { cspNonce, csrf } = useLoaderData<typeof loader>();
  console.log("qssdsqdqsd", csrf);
  console.log("cspNonce", cspNonce);

  return (
    <MantineProvider
      emotionCache={mantineCache}
      theme={theme}
      withGlobalStyles
      withNormalizeCSS
    >
      <html lang="en" style={{ height: "100%" }}>
        <head>
          <Meta />
          <Links />
          <StylesPlaceholder />
        </head>
        <body style={{ height: "100%" }}>
          <AuthenticityTokenProvider token={csrf}>
            <Outlet />
          </AuthenticityTokenProvider>
          <ScrollRestoration nonce={cspNonce} />
          <Scripts nonce={cspNonce} />
          <LiveReload nonce={cspNonce} />
        </body>
      </html>
    </MantineProvider>
  );
}
