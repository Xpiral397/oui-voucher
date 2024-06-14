"use client";
import React, { ReactNode } from "react";
import { Tabs, Tab, CardBody, Card } from "@nextui-org/react";
import { HomeIcon } from "@heroicons/react/outline";
import { ArchiveIcon } from "@heroicons/react/outline";
import { StatusOfflineIcon } from "@heroicons/react/outline";
import {
  Archive,
  Delete,
  Home,
  Payment,
  PowerInput,
  PowerRounded,
} from "@mui/icons-material";
import { FeatureCard } from "@/app/page";
import { FeaturesSection } from "./component/features";

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
