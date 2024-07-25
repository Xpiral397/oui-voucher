"use client";
import React, { ReactNode } from "react";
import { Tabs, Tab, CardBody, Card } from "@nextui-org/react";

import { StatusOfflineIcon } from "@heroicons/react/outline";
import {
  Archive,
  Delete,
  Home,
  Payment,
  PowerInput,
  PowerRounded,
} from "@mui/icons-material";

import { FeaturesSection } from "./component/features";

export default function Page() {
  return (
    <div className="flex flex-col w-full">
      <Tabs aria-label="Options" color="primary" variant="bordered">
        <Tab
          key="Home"
          title={
            <div className="flex items-center space-x-2">
              <Home />
              <span>Products & Features </span>
            </div>
          }
        >
          <Card>
            <CardBody className="dark:bg-slate-900 ">
              <FeaturesSection />
            </CardBody>
          </Card>
        </Tab>
        <Tab
          key="Voucher"
          title={
            <div className="flex items-center space-x-2">
              <Payment />
              <span>All Vouchers</span>
            </div>
          }
        ></Tab>
        <Tab
          key="music"
          title={
            <div className="flex items-center space-x-2">
              <Archive />
              <span>Avaliable Vouchers</span>
            </div>
          }
        />
        <Tab
          key="used"
          title={
            <div className="flex items-center space-x-2">
              <PowerRounded />
              <span>Used Vouchers</span>
            </div>
          }
        />
        <Tab
          key="Deleted Voucher"
          title={
            <div className="flex items-center space-x-2">
              <Delete />
              <span>Deleted Voucher</span>
            </div>
          }
        ></Tab>
        <Tab
          key="Expired"
          title={
            <div className="flex items-center space-x-2">
              <StatusOfflineIcon />
              <span>Expired </span>
            </div>
          }
        />
      </Tabs>
    </div>
  );
}
