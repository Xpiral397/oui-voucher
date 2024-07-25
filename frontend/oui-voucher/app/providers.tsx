"use client";

import * as React from "react";
import { NextUIProvider } from "@nextui-org/system";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";
import { UseUserProvider } from "@/contexts/users/userUser";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { UseSettings } from "@/contexts/settings/useSettings";
import { UseAdminProvider } from "@/contexts/users/useAdmin";
import { UseDashBoard as DashBoard } from "@/contexts/dashboard/useDashboard";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

export function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter();

  return (
    <NextUIProvider navigate={router.push}>
      <NextThemesProvider {...themeProps}>
        <UseSettings>
          <UseUserProvider>
            <DashBoard>
              <UseAdminProvider>{children}</UseAdminProvider>
            </DashBoard>
          </UseUserProvider>
          <ToastContainer />
        </UseSettings>
      </NextThemesProvider>
    </NextUIProvider>
  );
}
