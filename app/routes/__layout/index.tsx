import {
  Box,
  Center,
  Container,
  Image,
  Title,
  Text,
  Button,
  Group,
  Anchor,
} from "@mantine/core";
import { Link, useLoaderData } from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { isAuthenticated } from "~/services/auth.server";

import links from "~/utils/links";
import { hexToRgb } from "~/utils/misc";

export const loader = async ({ request }: LoaderArgs) => {
  const user = await isAuthenticated(request);
  return json({ auth: user });
};

export default function Index() {
  const { auth } = useLoaderData<typeof loader>();

  return (
    <Container size="xl">
      <Box pt="2rem">
        <Box
          sx={{
            position: "relative",
            borderRadius: "1rem",
            overflow: "hidden",
            height: "650px",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: "0px",
              right: "0px",
              bottom: "0px",
              left: "0px",
            }}
          >
            <img
              src="https://user-images.githubusercontent.com/6237350/188270696-0344d337-ccbe-4923-b51b-74a77781503f.jpg"
              alt="lee 'scratch' perry recording a song"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            <Box
              sx={(theme) => {
                const primaryColorRgb = hexToRgb(
                  theme.colors[theme.primaryColor][4]
                );
                return {
                  position: "absolute",
                  top: "0px",
                  right: "0px",
                  bottom: "0px",
                  left: "0px",
                  mixBlendMode: "multiply",
                  backgroundColor: `rgba(${primaryColorRgb.r},${primaryColorRgb.g},${primaryColorRgb.b},0.5)`,
                };
              }}
            ></Box>
          </Box>

          <Center
            pt="10rem"
            pb="3.5rem"
            sx={{ position: "relative", flexDirection: "column" }}
          >
            <Title
              order={1}
              sx={(theme) => ({
                color: theme.colors[theme.primaryColor][6],
                fontSize: "8rem",
                fontWeight: "bold",
                letterSpacing: "0.025em",
                "@media (max-width: 1100px)": {
                  fontSize: "5rem",
                },
                "@media (max-width: 730px)": {
                  fontSize: "3rem",
                },
              })}
            >
              SKA STACK
            </Title>

            <Text size="xl" color="white" weight={500} align="center" mx="2rem">
              Check the{" "}
              <Link style={{ color: "inherit" }} to={links.readme}>
                README.md
              </Link>{" "}
              file for instructions on how to get this project deployed.
            </Text>

            <Box mt="2rem">
              {auth ? (
                <Button
                  component={Link}
                  to={links.profile}
                  variant="filled"
                  size="lg"
                >
                  Profile for {auth.email}
                </Button>
              ) : (
                <Group>
                  <Button
                    component={Link}
                    to={links.join}
                    variant="white"
                    size="lg"
                  >
                    Sign up
                  </Button>
                  <Button component={Link} to="/login" size="lg">
                    Log In
                  </Button>
                </Group>
              )}
            </Box>

            <a href="https://remix.run">
              <Image
                src="https://user-images.githubusercontent.com/1500684/158298926-e45dafff-3544-4b69-96d6-d3bcc33fc76a.svg"
                alt="Remix"
                mt="4rem"
                width="14rem"
                height="100%"
              />
            </a>
          </Center>
        </Box>

        <Group position="center" mt="2rem" sx={{ gap: "2rem" }}>
          {[
            {
              src: "https://user-images.githubusercontent.com/6237350/187944087-1efade8f-1c3b-44b0-880f-8a06eddc0ead.svg",
              alt: "clever-cloud",
              href: "https://www.clever-cloud.com/",
            },
            {
              src: "https://user-images.githubusercontent.com/1500684/158238105-e7279a0c-1640-40db-86b0-3d3a10aab824.svg",
              alt: "PostgreSQL",
              href: "https://www.postgresql.org/",
            },
            {
              src: "https://user-images.githubusercontent.com/1500684/157764484-ad64a21a-d7fb-47e3-8669-ec046da20c1f.svg",
              alt: "Prisma",
              href: "https://prisma.io",
            },
            {
              src: "https://user-images.githubusercontent.com/6237350/188261377-f4b73096-9c35-4bb2-b048-9dd71cd65ae1.svg",
              alt: "Mantine",
              href: "https://mantine.dev",
            },
            {
              src: "https://user-images.githubusercontent.com/1500684/157764454-48ac8c71-a2a9-4b5e-b19c-edef8b8953d6.svg",
              alt: "Cypress",
              href: "https://www.cypress.io",
            },
            {
              src: "https://user-images.githubusercontent.com/1500684/157772386-75444196-0604-4340-af28-53b236faa182.svg",
              alt: "MSW",
              href: "https://mswjs.io",
            },
            {
              src: "https://user-images.githubusercontent.com/1500684/157772447-00fccdce-9d12-46a3-8bb4-fac612cdc949.svg",
              alt: "Vitest",
              href: "https://vitest.dev",
            },
            {
              src: "https://user-images.githubusercontent.com/1500684/157772662-92b0dd3a-453f-4d18-b8be-9fa6efde52cf.png",
              alt: "Testing Library",
              href: "https://testing-library.com",
            },
            {
              src: "https://user-images.githubusercontent.com/1500684/157772934-ce0a943d-e9d0-40f8-97f3-f464c0811643.svg",
              alt: "Prettier",
              href: "https://prettier.io",
            },
            {
              src: "https://user-images.githubusercontent.com/1500684/157772990-3968ff7c-b551-4c55-a25c-046a32709a8e.svg",
              alt: "ESLint",
              href: "https://eslint.org",
            },
            {
              src: "https://user-images.githubusercontent.com/1500684/157773063-20a0ed64-b9f8-4e0b-9d1e-0b65a3d4a6db.svg",
              alt: "TypeScript",
              href: "https://typescriptlang.org",
            },
          ].map((img) => (
            <Anchor
              key={img.href}
              href={img.href}
              sx={{
                display: "flex",
                maxWidth: "15rem",
                height: "4rem",
                justifyContent: "center",
                filter: "grayscale(100%);",
                "&:hover": {
                  filter: "grayscale(0);",
                },
                "&:focus": {
                  filter: "grayscale(0);",
                },
              }}
            >
              <img
                alt={img.alt}
                src={img.src}
                style={{ width: "100%", height: "100%" }}
              />
            </Anchor>
          ))}
        </Group>
      </Box>
    </Container>
  );
}
