"use client";
import React, { createContext, ReactNode, useEffect, useState } from "react";
import { useDashBoardPayLaod, DashBoard } from "../types";
import { base } from "@/base";
import { getToken } from "@/app/controller/auth/auth";
import { toast } from "react-toastify";

const DashBaord = "VCH:DashBaord";
export const useDashBoardContext = createContext<useDashBoardPayLaod>(
  {} as useDashBoardPayLaod
);

const saveDashBoard = (dashboard: DashBoard | null) => {
  try {
    localStorage.setItem("dashboard", JSON.stringify(dashboard));
  } catch (e) {}
};
const loadDashBoard = () => {
  try {
    return JSON.parse(localStorage.getItem("dashboard") ?? "null");
  } catch (e) {}
};
export function UseDashBoard({ children }: { children: ReactNode }) {
  const [dashboard, setDashBoards] = useState<DashBoard | null>(
    loadDashBoard()
  );

  const setDashBoard = (
    dashBoard: (dashboard: DashBoard | null) => DashBoard | null
  ) => {
    const data = dashBoard(dashboard);
    saveDashBoard(data);
    setDashBoards(data);
    console.log(data);
  };
  useEffect(() => {
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
        }
      })
      .then((data) => {
        setDashBoard((e) => (e ? { ...e, balance: data.balance } : e));

        // localStorage.setItem("balance", data?.balance);
      });
  }, [dashboard?.balance]);

  return (
    <useDashBoardContext.Provider
      value={{ dashboard, setDashBoard }}
      children={children}
    />
  );
}
