"use client";
import { createContext, ReactNode, useEffect, useState } from "react";
import { Admin, useAdminPayLoad } from "../types";
import { stringify } from "querystring";

export const useAdminContext = createContext<useAdminPayLoad>(
  {} as useAdminPayLoad
);

const saveAdmin = (admin: Admin | null) => {
  try {
    const data = JSON.stringify(admin);
    localStorage.setItem("BON::READER:Admin:DATA", data);
  } catch (err) {}
};

export function loadAdmin(): Admin | null {
  return JSON.parse(localStorage.getItem("BON::READER:Admin:DATA") ?? "null");
}

export function UseAdminProvider({ children }: { children: ReactNode }) {
  const [admin, _setAdmin] = useState<Admin | null>(null);

  useEffect(() => {
    _setAdmin(loadAdmin());
  }, []);
  const setAdmin = (data: (admin: Admin | null) => Admin | null) => {
    const value = data(admin);
    _setAdmin(value);
    saveAdmin(value);
  };

  return (
    <useAdminContext.Provider value={{ admin, setAdmin }}>
      {children}
    </useAdminContext.Provider>
  );
}
