"use client";
import { RecordWithTtl } from "dns";
import React, { ReactNode, useEffect } from "react";
// import { initialData, loadData } from "../context/clientStorage/save";
// import { InitialData } from "../context/type";
// import auth from "../context/reducers/auth";
// import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { stringify } from "querystring";

export default function Layout({ children }: { children: ReactNode }) {
  const router = useRouter();

  // specific data from the Redux storea

  // React to changes in the selected data
  // useEffect(() => {
  //   const data = loadData();
  //   if (data.auth.isAuthenticated) {
  //     router.push("/dashboard/discover");
  //   }
  // }, []); //
  return <div className="w-full h-full">{children}</div>;
}
