"use client";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { useState, useEffect } from "react";
import { base } from "@/base";
import { toast } from "react-toastify";
import { getToken } from "@/app/controller/auth/auth";
import { InvoicePDF } from "./component/InvoicePDF"; // Adjust the import path based on your project structure
import { Tooltip as ReactTooltip } from "react-tooltip";
import { InformationCircleIcon, UserIcon } from "@heroicons/react/outline";

export interface Fee {
  id: number;
  name: string;
  amount: string;
  used: boolean;
}

interface User {
  id: number;
  email: string;
  username: string;
  surname: string;
  other_name: string;
  matric_number: string;
  gender: string;
  graduation: string;
  level: string;
  telephone: string;
  faculty: string;
  department: string;
  is_student: boolean;
  is_admin: boolean;
}

interface Voucher {
  id: number;
  creator: User;
  created_for: User | null;
  fees: Fee[];
  timestamp: string;
  voucher_name: string;
  start_date: string;
  end_date: string;
  total_amount: string;
  transaction_id: string;
  token: string;
  reference_id: string;
}

export const generateToken = () => {
  return Array.from({ length: 24 }, () =>
    Math.random().toString(36).charAt(2)
  ).join("");
};

export const generateTransactionId = () => {
  return `TXN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
};

export const generateRefrenceID = () => {
  return `222-${Math.random().toString(36).substr(2, 11).toUpperCase()}`;
};

export function Page(param: any) {
  const [loading, setLoading] = useState(true);
  const [voucherData, setVoucherData] = useState<Voucher | null>(null);

  useEffect(() => {
    const fetchVoucher = async () => {
      const [voucher_id] = param.params.voucher_id as any;
      try {
        const res = await fetch(
          `${base}/voucher/get-voucher-by-id/${voucher_id}/`,
          {
            headers: {
              authorization: `Token ${getToken()}`,
            },
          }
        );
        const data = await res.json();
        return { data, id: voucher_id };
      } catch (e: any) {
        return { data: 500, id: voucher_id };
      }
    };

    fetchVoucher().then((voucher: { data: Voucher | number; id: string }) => {
      if (voucher.data === 500) {
        toast.error("Unable to load voucher: " + voucher?.id);
        setLoading(false);
      } else {
        setVoucherData(voucher?.data as Voucher);
        setLoading(false);
      }
    });
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  if (!voucherData) {
    return (
      <div className="flex justify-center w-full items-center">
        Voucher not found.
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col justify-center items-center p-10 ${getThemeClass()}`}
    >
      <h1 className="text-3xl font-bold mb-8 text-center">Voucher Details</h1>

      {/* Main Details */}
      <div
        className={`shadow-md rounded p-6 mb-8 w-full max-w-3xl grid grid-cols-3 ${getThemeClass()}`}
      >
        <DetailItem label="Voucher ID" value={voucherData.id.toString()} />
        <DetailItem label="Transaction ID" value={voucherData.transaction_id} />
        <DetailItem label="Token" value={generateToken()} />

        <DetailItem label="Reference ID" value={voucherData.reference_id} />
        <DetailItem label="Voucher Name" value={voucherData.voucher_name} />
        <DetailItem label="Total Amount" value={voucherData.total_amount} />
        <DetailItem label="Date Created" value={voucherData.timestamp} />
        <DetailItem label="Start Date" value={voucherData.start_date} />
        <DetailItem label="End Date" value={voucherData.end_date} />
      </div>

      {/* Creator Details */}
      <DetailsSection title="Creator Details" user={voucherData.creator} />

      {/* Created For Details */}
      {voucherData.created_for && (
        <DetailsSection
          title="Created For Details"
          user={voucherData.created_for}
        />
      )}

      {/* Fees Table */}
      <div
        className={`shadow-md rounded p-6 mb-8 w-full max-w-3xl ${getThemeClass()}`}
      >
        <h2 className="text-2xl font-bold mb-6">Fees</h2>
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="py-3 px-4 bg-gray-100 text-left text-sm font-bold text-gray-600 uppercase">
                Fee Name
              </th>
              <th className="py-3 px-4 bg-gray-100 text-left text-sm font-bold text-gray-600 uppercase">
                Amount
              </th>
              <th className="py-3 px-4 bg-gray-100 text-left text-sm font-bold text-gray-600 uppercase">
                Used
              </th>
            </tr>
          </thead>
          <tbody>
            {voucherData.fees.map((fee) => (
              <tr key={fee.id} className="border-b border-gray-200">
                <td className="py-4 px-6">{fee.name}</td>
                <td className="py-4 px-6">{fee.amount}</td>
                <td className="py-4 px-6">{fee.used ? "Yes" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PDF Download Button */}
      <PDFDownloadLink
        document={<InvoicePDF voucher={voucherData} />}
        fileName={`invoice_${voucherData.voucher_name}.pdf`}
      >
        {({ loading }) => (
          <button
            className={`bg-blue-500 text-white font-bold py-3 px-6 rounded-lg ${getThemeClass()} hover:bg-blue-600 transition duration-300 ease-in-out`}
          >
            {loading ? "Loading document..." : "Download PDF"}
          </button>
        )}
      </PDFDownloadLink>
    </div>
  );
}

const LoadingScreen = () => (
  <div className="flex justify-center items-center w-full h-screen">
    <div className="text-center">
      <p className="text-2xl font-bold mb-4">Loading...</p>
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
    </div>
  </div>
);

const DetailItem = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center mb-4">
    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-500 text-white">
      <InformationCircleIcon className="h-5 w-5" aria-hidden="true" />
    </div>
    <div className="ml-4">
      <p className="text-lg font-bold">{label}</p>
      <p className="text-gray-600">{value}</p>
    </div>
  </div>
);

const DetailsSection = ({ title, user }: { title: string; user: User }) => (
  <div
    className={`shadow-md rounded p-6 mb-8 w-full max-w-3xl ${getThemeClass()}`}
  >
    <div className="flex items-center mb-4">
      <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-500 text-white">
        <UserIcon className="h-5 w-5" aria-hidden="true" />
      </div>
      <h2 className="text-2xl font-bold ml-4">{title}</h2>
    </div>
    <div
      className="mb-2"
      data-tip={`Matric Number: ${user.matric_number}, Gender: ${user.gender}, Graduation: ${user.graduation}, Surname: ${user.surname}, Other Name: ${user.other_name}, Level: ${user.level}, Is Student: ${user.is_student ? "Yes" : "No"}, Is Admin: ${user.is_admin ? "Yes" : "No"}`}
    >
      <span className="font-bold text-lg">Name:</span> {user.username}
    </div>
    <div
      className="mb-2"
      data-tip={`Telephone: ${user.telephone}, Faculty: ${user.faculty}, Department: ${user.department}`}
    >
      <span className="font-bold text-lg">Email:</span> {user.email}
    </div>
    <ReactTooltip />
  </div>
);

const getThemeClass = () => {
  // Replace with your logic to determine theme mode (light/dark mode)
  const isDarkMode = false;
  return isDarkMode ? "bg-gray-800 text-white" : "bg-white";
};

export default Page;
