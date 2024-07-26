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
import { useAdminContext } from "@/contexts/users/useAdmin";
import { verifyLatPaymentReference } from "@/app/paystacks/route";
export const Navbar = () => {
  const { setting, setSettings } = useContext(settingContext);
  const [windows, setWindow] = useState<string>("");
  const [balance, setBalance] = useState(0.0);
  const { user, setUser } = useContext(useUserContext);
  const { admin, setAdmin } = useContext(useAdminContext);
  const router = useRouter();
  // consoe.log(admin);

  const Logout = (isAdmin: boolean) => {
    if (isAdmin) {
      router.push("admin/auth/login");
      localStorage.removeItem("BON::READER:Admin:DATA");
      toast.success("Logout sucessfully", {
        autoClose: 5000,
        position: "top-right",
      });
    } else {
      router.push("/auth/login");
      localStorage.removeItem("BON::READER:USER:DATA");
      toast.success("Logout sucessfully", {
        autoClose: 5000,
        position: "top-right",
      });
    }

    setUser((e) => {
      return { processing: true } as any;
    });
  };
  useEffect(() => {
    setWindow(window.location.href);
    console.log(admin, "Kop");
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
                  <DropdownItem key="profile" className="gap-2 h-14">
                    <p className="font-semibold ">
                      {user.surname + user.other_name}
                    </p>
                    <p className="font-semibold ">{user.email}</p>
                  </DropdownItem>
                  <DropdownItem key="team_settings">Invoice</DropdownItem>

                  <DropdownItem key="payment">Payment</DropdownItem>
                  <DropdownItem key="settings">My Settings</DropdownItem>
                  <DropdownItem
                    onClick={() => Logout(false)}
                    key="logout"
                    color="danger"
                  >
                    Log Out
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </>
          ) : admin && admin.email ? (
            <>
              <Dropdown placement="bottom-end">
                <DropdownTrigger>
                  <User
                    name={admin.username}
                    description={"Administrator"}
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
                  <DropdownItem key="balanced" className="gap-2 h-14">
                    <Button className="w-full text-[16px]   bg-blue-500 text-white dark:bg-slate-900 dark:text-slate-300">
                      Balance: NGN Virtual Account
                    </Button>
                  </DropdownItem>
                  <DropdownItem key="profile" className="gap-2 h-14">
                    <p className="font-semibold ">{admin.email}</p>
                  </DropdownItem>
                  <DropdownItem key="team_settings">Invoice</DropdownItem>
                  <DropdownItem key="payment">Payment</DropdownItem>
                  <DropdownItem key="settings">My Settings</DropdownItem>
                  <DropdownItem
                    onClick={() => Logout(true)}
                    key="logout"
                    color="danger"
                  >
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
              href={"/auth/login"}
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

      <NavbarMenu className="flex flex-row items-center w-full ">
        <div className="w-full rounded-md p-12  dark:shadow-zinc-900 shadow-2xl flex  justify-between space-x-[70px] -mt-[400px] ">
          <NavbarContent className=" sm:hidden basis-1" justify="end">
            <NavbarItem className="flex">
              {(() => {
                if (user && user.matric_number) {
                  return (
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
                          <DropdownItem key="profile" className="gap-2 h-14">
                            <p className="font-semibold ">
                              {user.surname + user.other_name}
                            </p>
                            <p className="font-semibold ">{user.email}</p>
                          </DropdownItem>
                          <DropdownItem key="team_settings">
                            Invoice
                          </DropdownItem>

                          <DropdownItem key="payment">Paymenet</DropdownItem>
                          <DropdownItem key="settings">
                            My Settings
                          </DropdownItem>
                          <DropdownItem
                            onClick={() => Logout(false)}
                            key="logout"
                            color="danger"
                          >
                            Log Out
                          </DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    </>
                  );
                } else if (admin && admin.email) {
                  return (
                    <>
                      <Dropdown placement="bottom-end">
                        <DropdownTrigger>
                          <User
                            name={admin.username}
                            description={"Administrator"}
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
                          <DropdownItem key="balanced" className="gap-2 h-14">
                            <Button className="w-full text-[16px]   bg-blue-500 text-white dark:bg-slate-900 dark:text-slate-300">
                              Balance: Virtual Account
                            </Button>
                          </DropdownItem>
                          <DropdownItem key="profile" className="gap-2 h-14">
                            <p className="font-semibold ">{admin?.email}</p>
                          </DropdownItem>
                          <DropdownItem key="team_settings">
                            Invoice
                          </DropdownItem>

                          <DropdownItem key="payment">Payment</DropdownItem>
                          <DropdownItem key="settings">
                            My Settings
                          </DropdownItem>
                          <DropdownItem
                            onClick={() => Logout(true)}
                            key="logout"
                            color="danger"
                          >
                            Log Out
                          </DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    </>
                  );
                } else {
                  <Button
                    isExternal
                    as={Link}
                    className="text-sm font-normal text-default-600 bg-default-100"
                    href={"/auth/login"}
                    // startContent={< className="text-danger" />}
                    variant="flat"
                  >
                    Login
                  </Button>;
                }
              })()}
            </NavbarItem>
          </NavbarContent>

          {user && user.matric_number ? (
            <div className="flex flex-col gap-2 mx-4 mt-2">
              {siteConfig.navMenuItems.map((item, index) => (
                <NavbarMenuItem key={`${item}-${index}`}>
                  <Link
                    color={
                      windows?.includes(item.label.toLowerCase())
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
              <Button onClick={() => Logout(true)} key="logout" color="danger">
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-2 mx-4 mt-2">
              <Link
                color={
                  !windows?.includes("/login") && !windows?.includes("/signup")
                    ? "danger"
                    : "foreground"
                }
                href="/"
                size="lg"
              >
                Home
              </Link>
              <Link
                color={windows?.includes("/login") ? "danger" : "foreground"}
                href="/auth/login"
                size="lg"
              >
                Login
              </Link>
              <Link
                color={windows?.includes("/signup") ? "danger" : "foreground"}
                href="/auth/signup"
                size="lg"
              >
                Signup
              </Link>
            </div>
          )}
        </div>
      </NavbarMenu>
    </NextUINavbar>
  );
};
