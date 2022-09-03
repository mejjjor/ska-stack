import React from "react";
import cx from "classnames";
import type { NavLinkProps } from "@remix-run/react";
import { NavLink } from "@remix-run/react";

interface NavLinkMantineProps extends NavLinkProps {
  clazzName: (props: { isActive: boolean }) => string | undefined;
}

export default function NavLinkMantine({
  className,
  clazzName,
  children,
  ...props
}: NavLinkMantineProps) {
  return (
    <NavLink
      className={({ isActive }) => cx(clazzName({ isActive }), className)}
      {...props}
    >
      {children}
    </NavLink>
  );
}
