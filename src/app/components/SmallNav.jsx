"use client";
import React from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarMenuToggle,
  NavbarMenuItem,
  NavbarMenu,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
} from "@nextui-org/react";
import styles from "./NavBars.module.css";

export default function SmallNav() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const menuItems = [
    { label: "Bands", href: "/festival" },
    { label: "Schedule", href: "/stages" },
    { label: "Map", href: "/map" },
    { label: "Buy Ticket", href: "/ticket-frontpage" },
    { label: "", href: "" },
    { label: "Favorites", href: "/favorites" },
  ];

  return (
    <Navbar
      isBordered
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      style={{ zIndex: 2000, position: "relative" }}
    >
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        />
      </NavbarContent>

      <NavbarContent className="sm:hidden pr-3" justify="center">
        <NavbarBrand>
          <Link className="font-bold text-inherit" href="/">
            FooFest
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarBrand>
          <p className="font-bold text-inherit">FooFest</p>
        </NavbarBrand>
        <NavbarItem>
          <Link
            className={styles.navbarlink}
            color="foreground"
            href="/festival"
          >
            Bands
          </Link>
        </NavbarItem>

        <NavbarItem isActive>
          <Link
            className={styles.navbarlink}
            href="/stages"
            aria-current="page"
          >
            Schedule
          </Link>
        </NavbarItem>

        <NavbarItem>
          <Link className={styles.navbarlink} color="foreground" href="/map">
            Map
          </Link>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem className="hidden lg:flex">
          <Link className={styles.navbarlink} href="favorites">
            Favorites
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Button
            as={Link}
            color="warning"
            href="/ticket-frontpage"
            variant="flat"
          >
            Tickets
          </Button>
        </NavbarItem>
      </NavbarContent>
      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item.label}-${index}`}>
            <Link
              className={`w-full ${styles.navbarlink}`}
              color={
                index === 2
                  ? "warning"
                  : index === menuItems.length - 1
                  ? "danger"
                  : "foreground"
              }
              href={item.href}
              size="lg"
            >
              {item.label}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}
