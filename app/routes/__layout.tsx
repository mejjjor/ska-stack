import { Outlet, useLoaderData, useCatch, useMatches } from "@remix-run/react";
import Nav from "~/components/Nav";
import links from "~/utils/links";
import { isAuthenticated } from "~/services/auth.server";
import type { LoaderArgs } from "@remix-run/server-runtime";

export const loader = async ({ request }: LoaderArgs) => {
  const user = await isAuthenticated(request);

  return { auth: user };
};

export default function Layout() {
  const { auth } = useLoaderData<typeof loader>();
  const data = useMatches();

  // force reload if __layout.tsx is auth but not first level in route
  if (auth && data[2].data.hasOwnProperty("auth") && !data[2].data.auth) {
    window.location.reload();
  }

  const linksData = [
    { link: links.home, label: "Home" },
    { link: links.readme, label: "README.md" },
  ];

  if (auth) {
    linksData.push({ link: links.profile, label: "Profile" });
  }

  return (
    <>
      <Nav links={linksData} showLogout={!!auth} />
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

// export function ErrorBoundary({ error }) {
//   return (
//     <div>
//       <h1>Error</h1>
//       <p>{error.message}</p>
//       <p>The stack trace is:</p>
//       <pre>{error.stack}</pre>
//     </div>
//   );
// }
