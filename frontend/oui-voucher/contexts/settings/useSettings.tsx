"use client";
import React, { createContext, ReactNode, useState } from "react";
import { useSettingsPayLaod, Settings } from "../types";

const SETTINGS = "VCH:SETTINGS";
export const settingContext = createContext<useSettingsPayLaod>(
  {} as useSettingsPayLaod
);

const saveSettings = (settings: Settings | null) => {
  try {
    localStorage.setItem(SETTINGS, JSON.stringify(settings));
  } catch (e) {}
};
const loadSettings = () => {
  try {
    return JSON.parse(localStorage.getItem(SETTINGS) ?? "null");
  } catch (e) {}
};
export function UseSettings({ children }: { children: ReactNode }) {
  const [setting, setSetting] = useState<Settings | null>(loadSettings());

  const setSettings = (
    settings: (settings: Settings | null) => Settings | null
  ) => {
    const data = settings(setting);
    saveSettings(data);
    setSetting(data);
  };

  return (
    <settingContext.Provider
      value={{ setting, setSettings }}
      children={children}
    />
  );
}
