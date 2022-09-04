import {
  createStyles,
  Header,
  Container,
  Group,
  Burger,
  Paper,
  Transition,
  Button,
  UnstyledButton,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Form } from "@remix-run/react";
import NavLinkMantine from "./NavLink";

const HEADER_HEIGHT = 60;

const useStyles = createStyles((theme) => ({
  root: {
    position: "relative",
    zIndex: 1,
  },

  dropdown: {
    position: "absolute",
    top: HEADER_HEIGHT,
    left: 0,
    right: 0,
    zIndex: 0,
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
    borderTopWidth: 0,
    overflow: "hidden",

    [theme.fn.largerThan("sm")]: {
      display: "none",
    },
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    height: "100%",
  },

  links: {
    [theme.fn.smallerThan("sm")]: {
      display: "none",
    },
    width: "100%",
  },

  burger: {
    [theme.fn.largerThan("sm")]: {
      display: "none",
    },
  },

  link: {
    display: "block",
    lineHeight: 1,
    padding: "10px 16px",
    borderRadius: theme.radius.sm,
    textDecoration: "none",
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[7],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    },

    [theme.fn.smallerThan("sm")]: {
      borderRadius: 0,
      padding: theme.spacing.md,
    },
  },

  linkActive: {
    "&, &:hover": {
      backgroundColor: theme.fn.variant({
        variant: "light",
        color: theme.primaryColor,
      }).background,
      color: theme.fn.darken(
        theme.fn.variant({ variant: "light", color: theme.primaryColor }).color,
        0.5
      ),
    },
  },

  formLogout: {
    display: "block",
  },
  logout: {
    width: "100%",
    color: theme.fn.variant({ variant: "white", color: theme.primaryColor })
      .color,
  },
}));

interface HeaderResponsiveProps {
  links: { link: string; label: string }[];
  showLogout: boolean;
}

export default function HeaderResponsive({
  links,
  showLogout,
}: HeaderResponsiveProps) {
  const [opened, { toggle, close }] = useDisclosure(false);
  const { classes, cx } = useStyles();

  const items = links.map((link) => {
    return (
      <NavLinkMantine
        key={link.label}
        to={link.link}
        clazzName={({ isActive }) => {
          return cx(classes.link, {
            [classes.linkActive]: isActive,
          });
        }}
        onClick={() => {
          close();
        }}
      >
        {link.label}
      </NavLinkMantine>
    );
  });

  return (
    <Header height={HEADER_HEIGHT} className={classes.root}>
      <Container className={classes.header} size="xl">
        <Group position="apart" className={classes.links}>
          <Group spacing={5}>{items}</Group>
          {showLogout && (
            <Form method="post" action="/api/auth/logout">
              <Button variant="light" type="submit">
                Logout
              </Button>
            </Form>
          )}
        </Group>

        <Burger
          aria-label="button burger menu"
          opened={opened}
          onClick={toggle}
          className={classes.burger}
          size="sm"
        />

        <Transition transition="pop-top-right" duration={200} mounted={opened}>
          {(styles) => (
            <Paper className={classes.dropdown} withBorder style={styles}>
              {items}
              {showLogout && (
                <Form
                  method="post"
                  action="/api/auth/logout"
                  className={cx(classes.formLogout)}
                >
                  <UnstyledButton
                    className={cx(classes.link, classes.logout)}
                    type="submit"
                  >
                    Logout
                  </UnstyledButton>
                </Form>
              )}
            </Paper>
          )}
        </Transition>
      </Container>
    </Header>
  );
}
