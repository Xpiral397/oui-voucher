"use client";
import React, { useContext, useEffect, useState } from "react";
import { Tabs, Tab, CardBody, Card } from "@nextui-org/react";
import {
  Balance,
  Home,
  PanoramaFishEye,
  Password,
  RemoveRedEye,
  VisibilityOff,
} from "@mui/icons-material";
import { FeaturesSection } from "./component/features";
import { useUserContext } from "@/contexts/users/userUser";
import { EyeIcon } from "@heroicons/react/outline";
import { EyeOffIcon } from "@heroicons/react/outline";
import { useDashBoardContext } from "@/contexts/dashboard/useDashboard";

export function MyDashBoardAACount() {
  const { user } = useContext(useUserContext);
  const { dashboard, setDashBoard } = useContext(useDashBoardContext);
  const setHide = () => {
    setDashBoard((e) =>
      e ? { ...e, hideBalance: !dashboard?.hideBalance } : e
    );
  };
  return (
    <div className="flex flex-col w-full p-4 font-[Helvtica] tracking-wide text-warning-foreground">
      <div className="relative p-8 mb-8 text-white rounded-lg shadow-lg dark:hidden bg-gradient-to-r from-pink-500 dark:from-purple-500 to-violet-500 dark:to-slate-900 dark:text-white">
        <div className="absolute inset-0 z-0 flex items-center justify-center">
          <div className="star-container opacity-[0.1]">
            <div className="star">
              <div className="w-5 h-5 bg-blue-600 rounded-full"></div>
            </div>
            <div className="star">
              <div className="w-5 h-5 ml-20 bg-blue-900 rounded-full"></div>
            </div>
            <div className="star">
              <div className="w-5 h-5 bg-blue-900 rounded-full ml-80"></div>
            </div>
            <div className="star">
              <div className="w-5 h-5 mt-40 ml-20 bg-blue-600 rounded-full"></div>
            </div>
            <div className="star">
              <div className="w-5 h-5 bg-blue-600 rounded-full mb-30 ml-60"></div>
            </div>
            <div className="star">
              <div className="w-5 h-5 ml-20 bg-blue-600 rounded-full"></div>
            </div>
            <div className="star">
              <div className="w-5 h-5 bg-blue-600 rounded-full"></div>
            </div>
          </div>
        </div>
        <div className="relative z-10 font-serif ">
          <h1 className="mb-4 font-sans text-4xl ">Welcome, {user?.surname}</h1>
          <div className="mt-3">
            <p className="text-4xl font-[400] font-[sans-serif, Poppin] font-[600] dark:text-white">
              {dashboard?.hideBalance ? (
                <div
                  className="flex items-center h-3 mb-2"
                  onClick={() => {
                    setHide();
                  }}
                >
                  <VisibilityOff className="h-5" />
                  <Password className="ml-3" fontSize="inherit" />
                  <Password fontSize="inherit" />
                </div>
              ) : (
                <div
                  onClick={() => {
                    setHide();
                  }}
                  className="flex items-center space-x-1 "
                >
                  <RemoveRedEye className="h-6 w-6 font-[600]" />
                  <span className="font-sans text-4xl">
                    {Number(dashboard?.balance ?? "0").toLocaleString()}
                  </span>
                </div>
              )}
            </p>
          </div>
          <p className="mt-4 text-xl">Matric Number: {user?.matric_number}</p>
          <p className="text-xl">Department Number: {user?.department}</p>
          <p className="text-xl">Level: {user?.level}</p>
        </div>
        <style jsx>{`
          .star-container {
            position: relative;
            width: 150px;
            height: 150px;
          }
          .star {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 150px;
            height: 150px;
            background: radial-gradient(
              circle,
              rgba(255, 255, 255, 0.5) 20%,
              transparent 70%
            );
            border-radius: 50%;
            transform: translate(-50%, -50%) rotate(0deg);
            animation: spin 6s linear infinite;
          }
          @keyframes spin {
            from {
              transform: translate(-50%, -50%) rotate(0deg);
            }
            to {
              transform: translate(-50%, -50%) rotate(360deg);
            }
          }
        `}</style>
      </div>

      <div className="relative hidden p-8 mb-8 text-white rounded-lg shadow-lg dark:block bg-gradient-to-rfrom-purple-500 to-violet-500 dark:text-white">
        <div className="absolute inset-0 z-0 flex items-center justify-center">
          <div className="star-container opacity-[0.1]">
            <div className="star">
              <div className="w-5 h-5 bg-blue-600 rounded-full"></div>
            </div>
            <div className="star">
              <div className="w-5 h-5 ml-20 bg-blue-900 rounded-full"></div>
            </div>
            <div className="star">
              <div className="w-5 h-5 bg-blue-900 rounded-full ml-80"></div>
            </div>
            <div className="star">
              <div className="w-5 h-5 mt-40 ml-20 bg-blue-600 rounded-full"></div>
            </div>
            <div className="star">
              <div className="w-5 h-5 bg-blue-600 rounded-full mb-30 ml-60"></div>
            </div>
            <div className="star">
              <div className="w-5 h-5 ml-20 bg-blue-600 rounded-full"></div>
            </div>
            <div className="star">
              <div className="w-5 h-5 bg-blue-600 rounded-full"></div>
            </div>
          </div>
        </div>
        <div className="relative z-10 font-serif ">
          <h1 className="mb-4 font-sans text-4xl ">Welcome, {user?.surname}</h1>
          <div className="mt-3">
            <p className="text-4xl font-[400] font-[sans-serif, Poppin] font-[600] dark:text-white">
              {dashboard?.hideBalance ? (
                <div
                  className="flex items-center h-3 mb-2"
                  onClick={() => {
                    setHide();
                  }}
                >
                  <VisibilityOff className="h-5" />
                  <Password className="ml-3" fontSize="inherit" />
                  <Password fontSize="inherit" />
                </div>
              ) : (
                <div
                  onClick={() => {
                    setHide();
                  }}
                  className="flex items-center space-x-1 "
                >
                  <RemoveRedEye className="h-6 w-6 font-[600]" />
                  <span className="font-sans text-4xl">840,390,293.83</span>
                </div>
              )}
            </p>
          </div>
          <p className="mt-4 text-xl">Matric Number: {user?.matric_number}</p>
          <p className="text-xl">Department Number: {user?.department}</p>
          <p className="text-xl">Level: {user?.level}</p>
        </div>
        <style jsx>{`
          .star-container {
            position: relative;
            width: 150px;
            height: 150px;
          }
          .star {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 150px;
            height: 150px;
            background: radial-gradient(
              circle,
              rgba(255, 255, 255, 0.5) 20%,
              transparent 70%
            );
            border-radius: 50%;
            transform: translate(-50%, -50%) rotate(0deg);
            animation: spin 6s linear infinite;
          }
          @keyframes spin {
            from {
              transform: translate(-50%, -50%) rotate(0deg);
            }
            to {
              transform: translate(-50%, -50%) rotate(360deg);
            }
          }
        `}</style>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <>
      <MyDashBoardAACount />
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
            <CardBody className="dark:bg-slate-900">
              <FeaturesSection />
            </CardBody>
          </Card>
        </Tab>
      </Tabs>
    </>
  );
}
