import React from "react";
import { Outlet, useLoaderData, useCatch } from "@remix-run/react";
import { useLocation } from "react-router-dom";
import Nav from "~/components/Nav";
import links from "~/utils/links";
import { useOptionalUser } from "~/utils/auth";

// import { isAuthenticated } from '~/services/auth.server';

// export const loader = async({ request }) => {
//   const user = await isAuthenticated(request);
//   if (user) {
//     return { isAuth: true };
//   } else {
//     return { isAuth: false };
//   }
// };

export default function Layout() {
  //   const { isAuth } = useLoaderData();

  //   const { pathname } = useLocation();
  const user = useOptionalUser();

  const linksData = [
    { link: links.home, label: "Home" },
    { link: links.readme, label: "README.md" },
  ];

  if (user) {
    linksData.push({ link: links.profile, label: "Profile" });
  }

  return (
    <>
      <Nav links={linksData} showLogout={!!user} />
      <main>
        <Outlet />
      </main>
    </>
  );
}

export function CatchBoundary() {
  const caught = useCatch();

  return (
    <div>
      <h1>Caught</h1>
      <p>Status: {caught.status}</p>
      <pre>
        <code>{JSON.stringify(caught.data, null, 2)}</code>
      </pre>
    </div>
  );
}

export function ErrorBoundary({ error }) {
  return (
    <div>
      <h1>Error</h1>
      <p>{error.message}</p>
      <p>The stack trace is:</p>
      <pre>{error.stack}</pre>
    </div>
  );
}
