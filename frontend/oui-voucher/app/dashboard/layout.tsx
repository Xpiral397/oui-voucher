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
    if (user && !user?.matric_number && !user.processing) {
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
    <div className="flex justify-center p-1 shadow-inner  dark:bg-slate-900 w-full">
      <div className="flex justify-between items-center  shadow-2xl  dark:shadow-slate-950 shadow-blue-500   rounded-md w-full h-full">
        <div className="sm:block hidden">
          <Sidebar />
        </div>
        <ScrollShadow hideScrollBar className="w-full h-screen">
          {children}
        </ScrollShadow>
      </div>
    </div>
  );
}
