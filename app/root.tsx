import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { MantineProvider, createEmotionCache } from "@mantine/core";
import { StylesPlaceholder } from "@mantine/remix";
import { generateHash } from "~/utils/misc";

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Remix boilerplate",
  viewport: "width=device-width,initial-scale=1",
});

const theme = {
  primaryColor: "violet",
};

const myCache = createEmotionCache({ key: "mantine" });

export const loader: LoaderFunction = async () => {
  return {
    cspNonce: generateHash(42),
  };
};

export default function App() {
  const { cspNonce } = useLoaderData<typeof loader>();

  return (
    <MantineProvider
      emotionCache={myCache}
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
          <Outlet />
          <ScrollRestoration nonce={cspNonce} />
          <Scripts nonce={cspNonce} />
          <LiveReload nonce={cspNonce} />
        </body>
      </html>
    </MantineProvider>
  );
}
