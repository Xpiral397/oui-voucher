"use client";
import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@nextui-org/navbar";
import { Button } from "@nextui-org/button";
import { Kbd } from "@nextui-org/kbd";
import { Link } from "@nextui-org/link";
import { Input } from "@nextui-org/input";
import { link as linkStyles } from "@nextui-org/theme";
import NextLink from "next/link";
import clsx from "clsx";
import { getToken } from "@/app/controller/auth/auth";
import { base } from "@/base";
import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import {
  TwitterIcon,
  GithubIcon,
  DiscordIcon,
  HeartFilledIcon,
  SearchIcon,
} from "@/components/icons";

import Logo from "@/public/logo.png";
import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Image,
  User,
} from "@nextui-org/react";
import { settingContext } from "@/contexts/settings/useSettings";
import { useContext, useEffect, useState } from "react";
import { FilterList, FormatListBulleted } from "@mui/icons-material";
import { useUserContext } from "@/contexts/users/userUser";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { User as Users } from "@/contexts/types";
export const Navbar = () => {
  const { setting, setSettings } = useContext(settingContext);
  const [balance, setBalance] = useState(0.0);
  const { user, setUser } = useContext(useUserContext);
  const router = useRouter();

  const Logout = () => {
    setUser((e) => {
      return {} as Users;
    });
    router.push("/login");
    toast.success("Logut sucessfully", {
      autoClose: 5000,
      position: "top-right",
    });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.reload();
    }, 60000);

    return () => clearTimeout(timer);
  }, []);
  useEffect(() => {
    (async () => {
      fetch(`${base}/voucher/get-balance`, {
        method: "GET",
        headers: {
          "Content-Type": "appliation/json",
          authorization: `Token ${getToken()}`,
        },
      })
        .then((data) => {
          if (data.ok) {
            // toast.success("User balnce fetched successfully");
            const data_ = data.json();
            return data_;
          } else {
            toast.error("Unable to  fetch user balnce ");
          }
        })
        .then((data) => {
          setBalance((e) => {
            return data?.balance;
          });
        });
    })();
  });
  return (
    <NextUINavbar
      maxWidth="full"
      className="shadow-md dark:bg-gray-900"
      position="sticky"
    >
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex items-center justify-start gap-1" href="/">
            {/* {user &&
              user.matric_number &&
              (setting && setting?.sidebar ? (
                <FilterList />
              ) : (
                <FormatListBulleted />
              ))} */}
            <Image src={Logo.src} width={40} height={40} />
            <p className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-500 ">
              OUI Voucher
            </p>
          </NextLink>
        </NavbarBrand>
        <ul className="justify-start hidden gap-4 ml-2 lg:flex">
          {siteConfig.navItems.map((item) => (
            <NavbarItem key={item.href}>
              <NextLink
                className={clsx(
                  linkStyles({ color: "foreground" }),
                  "data-[active=true]:text-primary data-[active=true]:font-medium"
                )}
                color="foreground"
                href={item.href}
              >
                {item.label}
              </NextLink>
            </NavbarItem>
          ))}
        </ul>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden gap-2 sm:flex">
          <ThemeSwitch />
        </NavbarItem>

        <NavbarItem className="flex">
          {user && user.matric_number ? (
            <>
              <Dropdown placement="bottom-end">
                <DropdownTrigger>
                  <User
                    name={user.surname}
                    description={user.department}
                    avatarProps={{
                      src: "https://i.pravatar.cc/150?u=a04258114e29026702d",
                    }}
                  />
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="Profile Actions"
                  variant="flat"
                  className="font-sans"
                >
                  <DropdownItem key="balanced" className="h-14 gap-2">
                    <Button className="w-full text-[16px] font-serif  bg-blue-500 text-white dark:bg-slate-900 dark:text-slate-300">
                      Balance: NGN {balance}
                    </Button>
                  </DropdownItem>
                  <DropdownItem key="profile" className="h-14 gap-2">
                    <p className="font-semibold font-[sans, Helvetica, Montserrat]">
                      {user.surname + user.other_name}
                    </p>
                    <p className="font-semibold font-[sans, Helvetica, Montserrat]">
                      {user.email}
                    </p>
                  </DropdownItem>
                  <DropdownItem key="team_settings">Invoice</DropdownItem>

                  <DropdownItem key="payment">Paymenet</DropdownItem>
                  <DropdownItem key="settings">My Settings</DropdownItem>
                  <DropdownItem onClick={Logout} key="logout" color="danger">
                    Log Out
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </>
          ) : (
            <Button
              isExternal
              as={Link}
              className="text-sm font-normal text-default-600 bg-default-100"
              href={siteConfig.links.sponsor}
              // startContent={< className="text-danger" />}
              variant="flat"
            >
              Login
            </Button>
          )}
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="pl-4 sm:hidden basis-1" justify="end">
        <ThemeSwitch />
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu>
        <div className="flex flex-col gap-2 mx-4 mt-2">
          {siteConfig.navMenuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                color={
                  index === 2
                    ? "primary"
                    : index === siteConfig.navMenuItems.length - 1
                      ? "danger"
                      : "foreground"
                }
                href="#"
                size="lg"
              >
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
        </div>
      </NavbarMenu>
    </NextUINavbar>
  );
};
