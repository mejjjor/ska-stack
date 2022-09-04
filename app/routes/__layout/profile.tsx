import { Button, Card, Container, Group, Input, List } from "@mantine/core";
import type { LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";

import { useFetcher } from "@remix-run/react";
import type { Session } from "~/models/session.server";
import { getSessionsByUserId } from "~/models/session.server";
import { isAuthenticated } from "~/services/auth.server";
import links from "~/utils/links";
import { superjson, useSuperLoaderData } from "~/utils/superjson";

export const loader = async ({ request }: LoaderArgs) => {
  const tokenData = await isAuthenticated(request);
  if (tokenData) {
    const sessions = await getSessionsByUserId(tokenData.userId);
    return superjson(
      { sessions, currentSession: tokenData.token },
      { headers: { "x-superjson": "true" } }
    );
  } else {
    return redirect(links.home);
  }
};

export default function Index() {
  const {
    sessions,
    currentSession,
  }: { sessions: Session[]; currentSession: string } = useSuperLoaderData();

  const deleteSession = useFetcher();

  return (
    <Container size="xl">
      SESSIONS :
      {sessions.map((session) => {
        return (
          <deleteSession.Form
            key={session.token}
            method="post"
            action="/api/auth/deleteSession"
          >
            <Input type="hidden" name="token" value={session.token} />
            <Card>
              <List>
                {Object.entries(session).map(([key, value]) => (
                  <List.Item key={key}>
                    {key} : <strong>{JSON.stringify(value)}</strong>
                  </List.Item>
                ))}
              </List>
              <Group position="right" mt="xl">
                {session.token === currentSession && "CURRENT SESSION"}
                <Button
                  type="submit"
                  disabled={deleteSession.state === "submitting"}
                >
                  Delete this session
                </Button>
              </Group>
            </Card>
          </deleteSession.Form>
        );
      })}
    </Container>
  );
}
