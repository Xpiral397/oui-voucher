"use client";
import React, { useContext, useEffect } from "react";
import {
  HomeIcon,
  DocumentTextIcon,
  CreditCardIcon,
  BellIcon,
  CogIcon,
} from "@heroicons/react/outline";
import { settingContext } from "@/contexts/settings/useSettings";
import { Divider } from "@nextui-org/react";

export function Sidebar() {
  const { setting, setSettings } = useContext(settingContext);
  useEffect(() => {}, [setting]);
  return (
    <div>
      <div
        className={`${setting?.sidebar ? "hidden" : "flex"}  mx-1 flex-col justify-between rounded-xl h-screen w-[200px] shadow-2xl bg-slate-50 dark:bg-slate-900 text-blue-900 dark:text-slate-200`}
      >
        <div>
          <div className="p-8 flex items-center justify-center">
            <h1 className="text-2xl font-bold">Dashboard</h1>
          </div>
          <Divider />
          <nav className="mt-10">
            <a
              href="/dashboard/voucher"
              className="flex items-center p-4 text-blue-900 dark:text-slate-200 hover:bg-blue-200 dark:hover:bg-slate-700 transition-colors duration-200"
            >
              <HomeIcon className="h-5 w-5 mr-3" />
              Vouchers
            </a>

            <a
              href="#"
              className="flex items-center p-4 text-blue-900 dark:text-slate-200 hover:bg-blue-200 dark:hover:bg-slate-700 transition-colors duration-200"
            >
              <CreditCardIcon className="h-5 w-5 mr-3" />
              Recharge
            </a>
            <a
              href="/dashboard/notifications"
              className="flex items-center p-4 text-blue-900 dark:text-slate-200 hover:bg-blue-200 dark:hover:bg-slate-700 transition-colors duration-200"
            >
              <BellIcon className="h-5 w-5 mr-3" />
              Notification
            </a>
          </nav>
        </div>
        <div className="mb-10">
          <a
            href="#"
            className="flex items-center p-4 text-blue-900 dark:text-slate-200 hover:bg-blue-200 dark:hover:bg-slate-700 transition-colors duration-200"
          >
            <CogIcon className="h-5 w-5 mr-3" />
            Settings
          </a>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
