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
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      label: "Fees Payment",
      href: "/dashboard/voucher/new",
    },
    {
      label: "Invoice",
      href: "/dashboard/voucher/manage",
    },
    {
      label: "Recharge",
      href: "/dashboard/recharge",
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
