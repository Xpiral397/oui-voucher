export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "OUI Voucher",
  description: "Make beautiful websites regardless of your design experience.",
  navItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Dashbaord",
      href: "/dashboard",
    },
  ],
  navMenuItems: [
    {
      label: "Dashbaord",
      href: "/dashboard",
    },
    {
      label: "Voucher",
      href: "/dashboard/voucher/new",
    },
    {
      label: "Invoice",
      href: "/dashboard/voucher/new",
    },
    {
      label: "Recharge",
      href: "/dashboard/voucher/new",
    },
    {
      label: "Notification",
      href: "/dashboard/voucher/new",
    },
    {
      label: "Settings",
      href: "/dashboard/voucher/new",
    },
  ],
  links: {
    github: "https://github.com/nextui-org/nextui",
    twitter: "https://twitter.com/getnextui",
    docs: "https://nextui.org",
    discord: "https://discord.gg/9b6yyZKmH4",
    sponsor: "https://patreon.com/jrgarciadev",
  },
};
