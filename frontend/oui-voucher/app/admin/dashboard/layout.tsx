"use client";
import React, { ReactNode, useContext, useEffect } from "react";
import Sidebar from "./sidebar";
import { ScrollShadow } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/contexts/users/userUser";
import { toast } from "react-toastify";
import { User } from "@/contexts/types";

export default function Layout({ children }: { children: ReactNode }) {
  const { user, setUser } = useContext(useUserContext);
  const router = useRouter();
  useEffect(() => {
    if (user && !user?.email) {
      router.push("/auth/login");
      toast.error("You cant't vist this page without not login in", {
        autoClose: 6000,
        position: "top-right",
      });
    } else {
      if (user?.processing) {
        setUser((e) => ({}) as User);
      }
    }
  }, [user]);
  return (
    <div className="flex justify-center w-full p-1 shadow-inner dark:bg-slate-900">
      <div className="flex items-center justify-between w-full h-full rounded-md shadow-2xl dark:shadow-slate-950 shadow-blue-500">
        <div className="hidden sm:block">
          <Sidebar />
        </div>
        <ScrollShadow hideScrollBar className="w-full h-screen">
          {children}
        </ScrollShadow>
      </div>
    </div>
  );
}
