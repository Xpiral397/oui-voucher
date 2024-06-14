"use client";
import { createContext, ReactNode, useEffect, useState } from "react";
import { User, useUserPaylaod } from "../types";
import { stringify } from "querystring";

export const useUserContext = createContext<useUserPaylaod>(
  {} as useUserPaylaod
);

const saveUser = (user: User | null) => {
  try {
    const data = JSON.stringify(user);
    localStorage.setItem("BON::READER:USER:DATA", data);
  } catch (err) {}
};

export function loadUser(): User | null {
  return JSON.parse(localStorage.getItem("BON::READER:USER:DATA") ?? "null");
}

export function UseUserProvider({ children }: { children: ReactNode }) {
  const [user, _setUser] = useState<User | null>(null);

  useEffect(() => {
    _setUser(loadUser());
  }, []);
  const setUser = (data: (user: User | null) => User | null) => {
    const value = data(user);
    _setUser(value);
    saveUser(value);
  };

  return (
    <useUserContext.Provider value={{ user, setUser }}>
      {children}
    </useUserContext.Provider>
  );
}
