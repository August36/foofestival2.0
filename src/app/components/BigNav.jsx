"use client"; // Add this at the top if it's a client component
import React from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
} from "@nextui-org/react";

export default function BigNav() {
  return (
    <Navbar shouldHideOnScroll>
      <NavbarBrand>
        <Link className="font-bold text-inherit" href="/">
          FooFest
        </Link>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link color="foreground" href="festival">
            Bands
          </Link>
        </NavbarItem>
        <NavbarItem isActive>
          <Link href="calender" aria-current="page">
            Schedule
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="stages">
            Stages
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="map">
            Map
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem className="hidden lg:flex">
          <Link href="favorites">Favorites</Link>
        </NavbarItem>
        <NavbarItem>
          <Button
            as={Link}
            color="primary"
            href="ticket-frontpage"
            variant="flat"
          >
            Tickets
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
