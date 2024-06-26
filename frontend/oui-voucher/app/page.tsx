"use client";
import React, { useContext } from "react";
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

export const FeatureCard = ({ title, description, icon }: any) => {
  return (
    <div className="flex flex-col items-center bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 m-4 w-[300px]">
      <div className="text-blue-500 dark:text-blue-300 mb-4">{icon}</div>
      <h3 className="text-lg font-bold mb-2 dark:text-white">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300 text-center">
        {description}
      </p>
    </div>
  );
};

export const FeaturesSection = () => {
  const features = [
    {
      title: "Add New Voucher",
      description: "Create new vouchers easily for payments.",
      icon: <PlusIcon className="h-12 w-12" />,
    },
    {
      title: "Delete Voucher",
      description: "Remove unused or expired vouchers.",
      icon: <TrashIcon className="h-12 w-12" />,
    },
    {
      title: "Archive Voucher",
      description: "Archive old vouchers for record-keeping.",
      icon: <ArchiveIcon className="h-12 w-12" />,
    },
    {
      title: "View Used Vouchers",
      description: "Check the status of used vouchers.",
      icon: <EyeIcon className="h-12 w-12" />,
    },
    {
      title: "Generate PDF Invoice",
      description: "Create and download PDF invoices.",
      icon: <DownloadIcon className="h-12 w-12" />,
    },
    {
      title: "Remote Payment",
      description: "Facilitate remote payments seamlessly.",
      icon: <OnlinePredictionRounded className="h-12 w-12" />,
    },
    {
      title: "Transaction View",
      description: "View all transactions in one place.",
      icon: <ClipboardListIcon className="h-12 w-12" />,
    },
    {
      title: "Voucher Scope Selection",
      description: "Select voucher scopes for different purposes.",
      icon: <SelectorIcon className="h-12 w-12" />,
    },
  ];

  return (
    <div
      className="rounded-lg shadow-xl bg-gray-100 dark:bg-gray-900 py-10"
      id="features"
    >
      <h2 className="text-3xl font-bold text-center mb-8 dark:text-white">
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
  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      {/* <header className="flex justify-between items-center py-4 px-6 bg-gray-100 dark:bg-gray-800">
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

      <main className="flex flex-col items-center mt-10 mx-auto max-w-6xl px-4">
        <div className="text-center md:w-2/3 mb-20 mx-10">
          <h1 className="dark:text-white text-slate-800 font-bold text-5xl mb-10">
            Oduduwa Online
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
              Voucher Payments
            </span>{" "}
            System
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-300 font-[400] text-center tracking-wide md:w-full w-[300px] mb-10">
            OUI Online Voucher School Fees Remote Payment.
          </p>
          <div className="w-full flex sm:flex-row flex-col sm:space-x-0 space-x-2">
            {" "}
            <a
              href={
                (user &&
                  ((user.matric_number && "/dashboard/voucher") ||
                    "/auth/signup")) ??
                "#"
              }
              className="w-full"
            >
              {user ? (
                <div className="w-full bg-gradient-to-r from-slate-900 to-purple-500 p-[1px] rounded-md mb-4">
                  <button className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-md w-full py-4 shadow-xl drop-shadow-2xl text-gray-300 font-bold">
                    Get Started
                  </button>
                </div>
              ) : (
                <Button
                  isLoading={true}
                  className="bg-gradient-to-r mb-4 from-blue-500  to-purple-500  rounded-md w-full py-4 shadow-sm drop-shadow-sm text-gray-400 font-bold"
                >
                  Loading...
                </Button>
              )}
            </a>
            {user && !user.matric_number ? (
              <a
                href={
                  (user &&
                    ((user.matric_number && "/auth/login") || "/auth/login")) ??
                  "#"
                }
                className="w-full"
              >
                <div className="w-full bg-gradient-to-r p-[1px] rounded-md">
                  <button className="bg-gradient-to-r  from-blue-500  to-purple-500  rounded-md w-full py-4 shadow-sm drop-shadow-sm text-gray-400 font-bold">
                    Login
                  </button>
                </div>
              </a>
            ) : (
              !user && (
                <Button
                  isLoading={true}
                  className="bg-gradient-to-r  from-blue-500  to-purple-500  rounded-md w-full py-4 shadow-sm drop-shadow-sm text-gray-400 font-bold"
                >
                  Loading...
                </Button>
              )
            )}
          </div>
        </div>

        <FeaturesSection />
      </main>

      <footer className=" mt-20 bg-gray-50 dark:bg-gray-800 py-6">
        <div className="container mx-auto flex justify-between items-center px-4">
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
