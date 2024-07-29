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
          <div className="flex items-center justify-center p-8">
            <h1 className="text-2xl font-bold">Dashboard</h1>
          </div>
          <Divider />
          <nav className="mt-10">
            {/* <a
              href="/admin/dashboard/voucher"
              className="flex items-center p-4 text-blue-900 transition-colors duration-200 dark:text-slate-200 hover:bg-blue-200 dark:hover:bg-slate-700"
            >
              <HomeIcon className="w-5 h-5 mr-3" />
              Vouchers
            </a> */}

            <a
              href="/admin/dashboard/recharge"
              className="flex items-center p-4 text-blue-900 transition-colors duration-200 dark:text-slate-200 hover:bg-blue-200 dark:hover:bg-slate-700"
            >
              <CreditCardIcon className="w-5 h-5 mr-3" />
              Voucher
            </a>
            {/* <a
              href="/admin/dashboard/notifications"
              className="flex items-center p-4 text-blue-900 transition-colors duration-200 dark:text-slate-200 hover:bg-blue-200 dark:hover:bg-slate-700"
            >
              <BellIcon className="w-5 h-5 mr-3" />
              Notification
            </a> */}
          </nav>
        </div>
        {/* <div className="mb-10">
          <a
            href="#"
            className="flex items-center p-4 text-blue-900 transition-colors duration-200 dark:text-slate-200 hover:bg-blue-200 dark:hover:bg-slate-700"
          >
            <CogIcon className="w-5 h-5 mr-3" />
            Settings
          </a>
        {/* </div> */}
      </div>
    </div>
  );
}

export default Sidebar;
