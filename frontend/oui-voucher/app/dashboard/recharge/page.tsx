"use client";
import { getToken } from "@/app/controller/auth/auth";
import { base } from "@/base";
import { useUserContext } from "@/contexts/users/userUser";
// import { Button, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
// import { PaystackButton } from "react-paystack";
import { toast } from "react-toastify";
// import PayStackContainer from "./paystack";

export function RechargeAccount() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const { user } = useContext(useUserContext);

  const publicKey = "pk_test_f9eed355387d0bda3ecf980e204780f4db40e156";

  const handlePaystackSuccessAction = (reference: any) => {
    setIsProcessing(false);
    alert(
      `Payment Successful! Reference ID: ${reference.reference} has been sent to your email.`
    );
  };

  const handlePayNowClick = () => {
    // if (!email || !code) {
    // alert("Please enter all the required details.");
    // return;
    // }
    setIsProcessing(true);
    alert(
      "After you pay, a reference ID will be sent to your email. Use it to recharge your account. If you don't, your payment won't be successful."
    );
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-white dark:bg-slate-900">
      <h1 className="mb-8 text-4xl font-bold text-slate-900 dark:text-white">
        Recharge
      </h1>
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg dark:bg-slate-800">
        <input
          type="text"
          value={user?.matric_number}
          disabled
          placeholder="Matric Number"
          className="w-full p-4 mb-4 bg-gray-100 border rounded-lg dark:bg-slate-700 dark:text-white"
        />
        <input
          type="email"
          value={user?.email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full p-4 mb-4 bg-gray-100 border rounded-lg dark:bg-slate-700 dark:text-white"
        />
        <input
          type="number"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Your Reference ID"
          className="w-full p-4 mb-4 bg-gray-100 border rounded-lg dark:bg-slate-700 dark:text-white"
        />
        <button
          onClick={handlePayNowClick}
          className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Pay Now
        </button>
      </div>
    </div>
  );
}

export function PaymentVoucher() {
  const [referenceId, setReferenceId] = useState("");
  const [processing, setIsProcessing] = useState(false);
  const { dashboard, setDashBoard } = useContext(useDashBoardContext);

  const handleLoadVoucher = async () => {
    setIsProcessing(true);
    if (referenceId) {
      try {
        const response = await axios.post(
          `${base}/voucher/recharge/`,
          { token: referenceId },
          {
            headers: {
              Authorization: `Token ${getToken()}`,
            },
          }
        );
        if (response.status == 409) {
          toast.error("This voucher has been used by you");
        } else if (response.status == 200) {
          toast.success("Voucher loaded successfully");
          setReferenceId("");
          setDashBoard((e: any) => ({ ...e, balance: response.data.balance }));
        } else if (response.status == 400) {
          toast.error("This voucher does not exist");
        }
      } catch (e: any) {
        console.log(e);
        if (e.response.status === 400) {
          toast.error("Invalid Voucher");
        } else if (e.response.status == 409) {
          toast.error("This voucher has been used by you");
        } else {
          toast.error("Failed to load voucher. Please try again later");
        }
      }
      console.log("Loading voucher with reference ID:", referenceId);
    } else {
      alert("Please enter a reference ID.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-white dark:bg-slate-900">
      <div className="w-full max-w-md p-8 bg-gray-100 rounded-lg shadow-lg dark:bg-slate-800">
        <h2 className="mb-4 text-2xl font-bold text-center text-gray-900 dark:text-white">
          Load My Voucher
        </h2>
        <div className="mb-4">
          <label
            htmlFor="referenceId"
            className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Voucher Token
          </label>
          <input
            type="text"
            id="referenceId"
            value={referenceId}
            onChange={(e) => setReferenceId(e.target.value)}
            className="w-full px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg shadow-sm dark:bg-slate-700 dark:text-white dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your voucher token"
          />
        </div>
        <button
          onClick={handleLoadVoucher}
          className="w-full px-4 py-2 text-white bg-green-600 rounded-lg shadow-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
        >
          Load Voucher
        </button>
      </div>
    </div>
  );
}

// import React, { useContext } from "react";
import { Tabs, Tab, CardBody, Card } from "@nextui-org/react";
import {
  AssessmentOutlined,
  CardGiftcard,
  Home,
  Payment,
} from "@mui/icons-material";
import { CardActions } from "@mui/material";
import { MyDashBoardACount } from "../voucher/page";
import { headers } from "next/headers";
import axios from "axios";
import { useDashBoardContext } from "@/contexts/dashboard/useDashboard";
// import { DashBoardContext } from "@/contexts/settings/useDashboard";

export default function Page() {
  const { user } = useContext(useUserContext);

  return (
    <div className="flex flex-col w-full p-4 font-[Helvtica] tracking-wide text-warning-foreground">
      <MyDashBoardACount />
      <Tabs aria-label="Options" color="primary" variant="bordered">
        {/* <Tab
          key="Home"
          title={
            <div className="flex items-center space-x-2">
              <Payment />
              <span>Pay With Card</span>
            </div>
          }
        >
          <Card>
            <CardBody className="dark:bg-slate-900">
              <RechargeAccount />
            </CardBody>
          </Card>
        </Tab> */}
        <Tab
          key="load"
          title={
            <div className="flex items-center space-x-2">
              <AssessmentOutlined />
              <span>Load My Voucher</span>
            </div>
          }
        >
          <Card>
            <CardBody className="dark:bg-slate-900">
              <PaymentVoucher />
            </CardBody>
          </Card>
        </Tab>
      </Tabs>
    </div>
  );
}
