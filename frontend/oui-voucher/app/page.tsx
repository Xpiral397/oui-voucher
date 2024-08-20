"use client";
import React, { useContext, useEffect } from "react";
import { Link } from "@nextui-org/link";
import {
  PlusIcon,
  TrashIcon,
  ArchiveIcon,
  EyeIcon,
  DownloadIcon,
  ClipboardListIcon,
  SelectorIcon,
} from "@heroicons/react/outline";
import { OnlinePredictionRounded } from "@mui/icons-material";
import Logo from "@/public/logo.png";
import { useUserContext } from "@/contexts/users/userUser";
import { Button } from "@nextui-org/button";
import { useAdminContext } from "@/contexts/users/useAdmin";

export const FeatureCard = ({ title, description, icon }: any) => {
  return (
    <div className="flex flex-col items-center bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 m-4 w-[300px]">
      <div className="mb-4 text-blue-500 dark:text-blue-300">{icon}</div>
      <h3 className="mb-2 text-lg font-bold dark:text-white">{title}</h3>
      <p className="text-center text-gray-600 dark:text-gray-300">
        {description}
      </p>
    </div>
  );
};

export const FeaturesSection = () => {
  const features = [
    {
      title: "Make New Payment",
      description: "Create new vouchers easily for payments.",
      icon: <PlusIcon className="w-12 h-12" />,
    },
    {
      title: "Recharge Account",
      description: "Check the status of used vouchers.",
      icon: <EyeIcon className="w-12 h-12" />,
    },
    {
      title: "Manage Payment & Generate Invoices",
      description: "Create and download PDF invoices.",
      icon: <DownloadIcon className="w-12 h-12" />,
    },
  ];

  return (
    <div
      className="py-10 bg-gray-100 rounded-lg shadow-xl dark:bg-gray-900"
      id="features"
    >
      <h2 className="mb-8 text-3xl font-bold text-center dark:text-white">
        Features
      </h2>
      <div className="flex flex-wrap justify-center">
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            title={feature.title}
            description={feature.description}
            icon={feature.icon}
          />
        ))}
      </div>
    </div>
  );
};

const Page = () => {
  const { user, setUser } = useContext(useUserContext);
  const { admin, setAdmin } = useContext(useAdminContext);
  useEffect(() => {
    console.log(user, "user");
  }, []);
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* <header className="flex items-center justify-between px-6 py-4 bg-gray-100 dark:bg-gray-800">
        <img src={Logo.src} alt="Logo" className="h-10" />
        <nav className="space-x-4">
          <Link href="#features" className="text-gray-800 dark:text-gray-200">
            Features
          </Link>
          <Link href="#contact" className="text-gray-800 dark:text-gray-200">
            Contact
          </Link>
        </nav>
      </header> */}

      <main className="flex flex-col items-center max-w-6xl px-4 mx-auto mt-10">
        <div className="mx-10 mb-20 text-center md:w-2/3">
          <h1 className="mb-10 text-5xl font-bold dark:text-white text-slate-800">
            Pay All Your Fee Remotely
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-500">
              Today
            </span>{" "}
            System
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-300 font-[400] text-center tracking-wide md:w-full w-[300px] mb-10">
            OUI Online School Payment Portal
          </p>
          <div className="flex flex-col w-full space-x-2 sm:flex-row sm:space-x-0">
            {" "}
            <a
              href={
                (user &&
                  ((user.matric_number && "/dashboard/voucher") ||
                    "/auth/signup")) ??
                (admin &&
                  ((admin.email && "/admin/dashboard/voucher") ||
                    "/auth/signup")) ??
                "#"
              }
              className="w-full"
            >
              {((user?.email || (admin && admin.email)) && (
                <div className="w-full bg-gradient-to-r from-slate-900 to-purple-500 p-[1px] rounded-md mb-4">
                  <button className="w-full py-4 font-bold text-gray-300 rounded-md shadow-xl bg-gradient-to-r from-blue-500 to-purple-500 drop-shadow-2xl">
                    Get Started
                  </button>
                </div>
              )) || (
                <Button
                  isLoading={true}
                  className="w-full py-4 mb-4 font-bold text-gray-400 rounded-md shadow-sm bg-gradient-to-r from-blue-500 to-purple-500 drop-shadow-sm"
                >
                  Loading...
                </Button>
              )}
            </a>
            {(!user?.email && !admin?.email && (
              <a href={"/auth/login"} className="w-full">
                <div className="w-full bg-gradient-to-r p-[1px] rounded-md">
                  <button className="w-full py-4 font-bold text-gray-400 rounded-md shadow-sm bg-gradient-to-r from-blue-500 to-purple-500 drop-shadow-sm">
                    Login
                  </button>
                </div>
              </a>
            )) ||
              (!user && !admin && (
                <Button
                  isLoading={true}
                  className="w-full py-4 font-bold text-gray-400 rounded-md shadow-sm bg-gradient-to-r from-blue-500 to-purple-500 drop-shadow-sm"
                >
                  Loading...
                </Button>
              ))}
          </div>
        </div>

        <FeaturesSection />
      </main>

      <footer className="py-6 mt-20 bg-gray-50 dark:bg-gray-800">
        <div className="container flex items-center justify-between px-4 mx-auto">
          <img src={Logo.src} alt="Logo" className="h-10" />
          <p className="text-gray-800 dark:text-gray-200">
            &copy; 2024 Oduduwa Online. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Page;
