import { renderToString } from "react-dom/server";
import { RemixServer } from "@remix-run/react";
import type { EntryContext } from "@remix-run/node";
import { injectStyles, createStylesServer } from "@mantine/remix";
import { getContentSecurityPolicy } from "~/utils/csp";

const server = createStylesServer();

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  let markup = renderToString(
    <RemixServer context={remixContext} url={request.url} />
  );

  const nonce = remixContext.routeData.root?.cspNonce;
  // remixContext.appState.catchBoundaryRouteId === "root" &&
  // remixContext.appState.error
  //   ? undefined
  //   : remixContext.routeData.root?.cspNonce;

  responseHeaders.set("Content-Type", "text/html");
  process.env.NODE_ENV == "production" &&
    responseHeaders.set(
      "Content-Security-Policy",
      getContentSecurityPolicy({ nonce, strictDynamic: true })
    );

  return new Response(`<!DOCTYPE html>${injectStyles(markup, server)}`, {
    status: responseStatusCode,
    headers: responseHeaders,
  });
}
