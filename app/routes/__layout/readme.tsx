import { Box, Container } from "@mantine/core";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { marked } from "marked";

type LoaderData = { html: string };

export async function loader() {
  const data = await fetch(
    "https://raw.githubusercontent.com/mejjjor/ska-stack/main/README.md"
  );

  const readMe = await data.text();
  const html = marked(readMe);
  return json<LoaderData>({ html });
}

export default function Index() {
  const { html } = useLoaderData();
  return (
    <Container size="xl">
      <Box pt="2rem" dangerouslySetInnerHTML={{ __html: html }}></Box>
    </Container>
  );
}
