import type { MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { MantineProvider, createEmotionCache } from "@mantine/core";
import { StylesPlaceholder } from "@mantine/remix";

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Remix boilerplate",
  viewport: "width=device-width,initial-scale=1",
});

const theme = {
  primaryColor: "violet",
};

const myCache = createEmotionCache({ key: "mantine" });

export default function App() {
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
          <ScrollRestoration />
          <Scripts />
          <LiveReload />
        </body>
      </html>
    </MantineProvider>
  );
}
