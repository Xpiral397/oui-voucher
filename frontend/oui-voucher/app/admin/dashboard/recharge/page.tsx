"use client";
import React, { useState, useEffect } from "react";
import Logo from "@/public/logo.png"; // Adjust the import based on your project structure
import { jsPDF } from "jspdf";
import { v4 as uuidv4 } from "uuid"; // Import uuid library
import { Card, CardBody, Tab, Tabs } from "@nextui-org/react";
import { Analytics, DataUsage, Payment, Verified } from "@mui/icons-material";
import { toast } from "react-toastify";
import { base } from "@/base";

interface Voucher {
  amount: string;
  token: string;
  serial: string;
  serial_number: string;
  created_at: Date;
  used: boolean;
  date_used?: Date;
}

const generateNumericSerial = (length: number): string => {
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;
  return Math.floor(Math.random() * (max - min + 1) + min).toString();
};

export function VoucherGenerator() {
  const [amount, setAmount] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [voucherCodeLength, setVoucherCodeLength] = useState<number>(16); // Default length
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const generateVouchers = () => {
    setIsAuthenticated(false);
    const newVouchers: Voucher[] = [];
    for (let i = 0; i < Math.min(quantity, 33); i++) {
      newVouchers.push({
        amount,
        serial: uuidv4().substring(1, 16), // Generate UUID for serial
        serial_number: generateNumericSerial(voucherCodeLength), // Generate numeric serial number
        created_at: new Date(),
        token: generateNumericSerial(17),
        used: false,
      });
    }
    setVouchers(newVouchers);
  };

  const saveVouchers = async () => {
    const id = toast.loading("Authenticating and Encrypting Voucher");
    try {
      const response = await fetch(`${base}/voucher/vouchers/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authentication: `Token ${getToken("Admin")}`,
        },
        body: JSON.stringify(vouchers),
      });

      if (!response.ok) {
        // throw new Error("Failed to save vouchers");
        toast.dismiss(id);
        toast.error("Voucher Authentication Failed");
      } else {
        const data = await response.json();
        console.log(data.message);
        toast.dismiss(id);
        toast.success("All Vouchers Authenticated ");
        setIsAuthenticated(true);
      }
    } catch (error) {
      toast.dismiss(id);
      // console.error("Error saving vouchers:", error);
      toast.error("Voucher Authentication Failed");
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 3;
    const cardWidth = (pageWidth - margin * 3) / 3; // Two columns per page
    const cardHeight = (pageHeight - margin * 9) / 9; // Two rows per page

    // Add Watermark
    // doc.addImage(
    //   Logo.src,
    //   "PNG",
    //   margin,
    //   margin,
    //   pageWidth - margin * 2,
    //   pageHeight - margin * 2,
    //   "",
    //   "S",
    //   0.1
    // );
    // doc.addGState({})

    vouchers.forEach((voucher, index) => {
      const row = Math.floor(index / 3); // 2 vouchers per row
      const col = index % 3;
      const x = margin + col * cardWidth;
      const y = margin + row * cardHeight;

      if (index > 33) {
        doc.addPage(); // Add a new page after every 2 vouchers
      }

      doc.setFontSize(9);
      doc;
      doc.text("Oduduwa University Ipetumodu", x + 10, y + 10);
      doc.text(`Amount: ${voucher.amount}`, x + 10, y + 13);
      doc.text(`Serial: ${voucher.serial}`, x + 10, y + 16);
      doc.text(`Serial Number: ${voucher.serial_number}`, x + 10, y + 19);
      doc.text(`Token: ${voucher.token}`, x + 10, y + 22);
      doc.text(
        `Created At: ${voucher.created_at.toLocaleString()}`,
        x + 10,
        y + 25
      );
      // doc.setFontSize(12);
    });

    doc.save("vouchers.pdf");
  };

  return (
    <div className="relative z-10 p-8 bg-white dark:bg-slate-900">
      <div
        className="absolute inset-0 z-0 bg-no-repeat bg-cover opacity-10"
        style={{ backgroundImage: `url(${Logo.src})` }}
      ></div>
      <div className="relative z-20 p-6 bg-white bg-opacity-90 dark:bg-slate-800 dark:bg-opacity-90">
        <h1 className="mb-8 text-3xl font-bold text-center text-slate-900 dark:text-white">
          Voucher Generator
        </h1>
        <div className="space-y-4">
          <div>
            <label className="block mb-2 text-slate-700 dark:text-white">
              Amount:
            </label>
            <select
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-2 bg-gray-100 border rounded-lg dark:bg-slate-700 dark:text-white"
            >
              <option value="">Select Amount</option>
              <option value="5000">5,000</option>
              <option value="10000">10,000</option>
              <option value="20000">20,000</option>
              <option value="50000">50,000</option>
              <option value="100000">100,000</option>
              <option value="200000">200,000</option>
              <option value="500000">500,000</option>
            </select>
          </div>
          <div>
            <label className="block mb-2 text-slate-700 dark:text-white">
              Quantity:
            </label>
            <input
              type="number"
              value={quantity}
              max={33}
              onChange={(e) => setQuantity(Number(e.target.value))}
              min="1"
              className="w-full p-2 bg-gray-100 border rounded-lg dark:bg-slate-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block mb-2 text-slate-700 dark:text-white">
              Voucher Code Length:
            </label>
            <select
              value={voucherCodeLength}
              onChange={(e) => setVoucherCodeLength(Number(e.target.value))}
              className="w-full p-2 bg-gray-100 border rounded-lg dark:bg-slate-700 dark:text-white"
            >
              <option value={16}>12</option>
              <option value={18}>8</option>
              <option value={12}>10</option>
              <option value={25}>98</option>
            </select>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={generateVouchers}
              className="px-4 py-2 font-bold text-white bg-blue-500 rounded-lg hover:bg-blue-700 dark:bg-slate-700 dark:hover:bg-slate-900"
            >
              Generate Vouchers
            </button>
            <button
              onClick={saveVouchers}
              className="px-4 py-2 font-bold text-white bg-blue-500 rounded-lg hover:bg-blue-700 dark:bg-slate-700 dark:hover:bg-slate-900"
            >
              Authenticate Vouchers
            </button>
            <button
              disabled={!isAuthenticated}
              onClick={downloadPDF}
              className={`${!isAuthenticated ? "opacity-[0.1]" : ""} px-4 py-2 font-bold text-white bg-green-500 rounded-lg hover:bg-green-700 dark:bg-slate-700 dark:hover:bg-slate-900`}
            >
              Download as PDF
            </button>
          </div>
        </div>
        {vouchers.length > 0 && (
          <div className="mt-8">
            <h2 className="mb-4 text-2xl font-bold text-center text-slate-900 dark:text-white">
              Generated Vouchers
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {vouchers.map((voucher, index) => (
                <div key={index} className="p-4 border rounded-lg watermark">
                  <p>Amount: {voucher.amount}</p>
                  <p>Serial: {voucher.serial}</p>
                  <p>Serial Number: {voucher.serial_number}</p>
                  <p>
                    Created At: {new Date(voucher.created_at).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import { useTheme } from "next-themes";
import axios from "axios";
import { getToken } from "@/app/controller/auth/auth";

interface Voucher {
  amount: string;
  serial: string;
  serial_number: string;
  created_at: Date;
  used: boolean;
  date_used?: Date;
}

const amounts = [
  "5000",
  "10000",
  "20000",
  "50000",
  "100000",
  "200000",
  "500000",
];

const ListVoucher: React.FC = () => {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    // Fetch vouchers from the backend
    axios.get(`${base}/voucher/vouchers/`).then((response) => {
      setVouchers(response.data);
    });
  }, []);

  const handleThemeChange = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const getVouchersByAmount = (amount: string) => {
    return vouchers.filter(
      (voucher) => Number(voucher.amount) === Number(amount)
    );
  };

  const calculateTotals = (vouchers: Voucher[]) => {
    const totalAmount = vouchers.reduce(
      (sum, voucher) => sum + parseFloat(voucher.amount),
      0
    );
    const totalUsed = vouchers.filter((v) => v.used).length;
    const totalUnused = vouchers.filter((v) => !v.used).length;

    return { totalAmount, totalUsed, totalUnused };
  };

  const cardColors: { [key: string]: string } = {
    "5000": "bg-blue-50",
    "10000": "bg-green-50",
    "20000": "bg-yellow-50",
    "50000": "bg-red-50",
    "100000": "bg-purple-50",
    "200000": "bg-pink-50",
    "500000": "bg-indigo-50",
  };

  return (
    <div
      className={`min-h-screen p-6 ${theme === "dark" ? "bg-black text-white" : "bg-white text-black"}`}
    >
      <button
        onClick={handleThemeChange}
        className="px-4 py-2 mb-4 font-bold text-white bg-blue-500 rounded-lg hover:bg-blue-700"
      >
        Toggle Theme
      </button>

      <h1 className="mb-6 text-3xl font-bold">Voucher Statistics</h1>

      <div className="grid grid-cols-3 gap-3">
        {amounts.map((amount) => {
          const vouchersByAmount = getVouchersByAmount(amount);
          const { totalAmount, totalUsed, totalUnused } =
            calculateTotals(vouchersByAmount);

          return (
            <div
              key={amount}
              className={`mb-6 p-4 border rounded-lg ${cardColors[amount]}`}
            >
              <h2 className="mb-4 text-2xl font-bold">Amount: {amount}</h2>
              {vouchersByAmount.length > 0 ? (
                <>
                  <p>Total Amount (NGN): {totalAmount.toLocaleString()}</p>
                  <p>Total Used: {totalUsed}</p>
                  <p>Total Unused: {totalUnused}</p>
                </>
              ) : (
                <p>No vouchers available for this amount.</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// components/UsedVoucherList.js

function UsedVoucherList() {
  const [vouchers, setVouchers] = useState<Array<any>>([]);
  const [amountFilter, setAmountFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [voucherFilter, setVoucherFilter] = useState("");
  const [matricFilter, setMatricFilter] = useState("");

  useEffect(() => {
    axios
      .get(`${base}/voucher/used-vouchers/`)
      .then((response) => setVouchers(response.data))
      .catch((error) => console.error("Error fetching vouchers:", error));
  }, []);

  const filteredVouchers = vouchers.filter((voucher) => {
    const matchesAmount = amountFilter
      ? voucher.amount.toString().includes(amountFilter)
      : true;
    const matchesDate = dateFilter
      ? new Date(voucher.date_created).toISOString().slice(0, 10) === dateFilter
      : true;
    const matchesVoucherToken = voucherFilter
      ? voucher.generated_voucher.includes(voucherFilter)
      : true;
    const matchesMatricNumber = matricFilter
      ? voucher.student.matric_number.includes(matricFilter)
      : true;

    return (
      matchesAmount && matchesDate && matchesVoucherToken && matchesMatricNumber
    );
  });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Used Vouchers</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
        <input
          type="text"
          placeholder="Filter by amount"
          value={amountFilter}
          onChange={(e) => setAmountFilter(e.target.value)}
          className="p-2 border rounded"
        />
        <input
          type="date"
          placeholder="Filter by date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Filter by voucher token"
          value={voucherFilter}
          onChange={(e) => setVoucherFilter(e.target.value)}
          className="p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Filter by matric number"
          value={matricFilter}
          onChange={(e) => setMatricFilter(e.target.value)}
          className="p-2 border rounded"
        />
      </div>
      <table className="min-w-full bg-white dark:bg-gray-800 text-black dark:text-white">
        <thead>
          <tr>
            <th className="py-2">Student Name</th>
            <th className="py-2">Matric Number</th>
            <th className="py-2">Level</th>
            <th className="py-2">Voucher Token</th>
            <th className="py-2">Amount</th>
            <th className="py-2">Date Used</th>
          </tr>
        </thead>
        <tbody>
          {filteredVouchers.map((voucher) => (
            <tr key={voucher.id} className="border-b">
              <td className="py-2">
                {voucher.student.first_name} {voucher.student.last_name}
              </td>
              <td className="py-2">{voucher.student.matric_number}</td>
              <td className="py-2">{voucher.student.level}</td>
              <td className="py-2">{voucher.generated_voucher}</td>
              <td className="py-2">{voucher.amount}</td>
              <td className="py-2">
                {new Date(voucher.date_created).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function Page() {
  return (
    <div className="flex flex-col w-full p-4 font-[Helvetica] tracking-wide text-warning-foreground">
      <Tabs aria-label="Options" color="primary" variant="bordered">
        <Tab
          key="Home"
          title={
            <div className="flex items-center space-x-2">
              <Payment />
              <span>Create Vouchers</span>
            </div>
          }
        >
          <Card>
            <CardBody className="dark:bg-slate-900">
              <VoucherGenerator />
            </CardBody>
          </Card>
        </Tab>
        <Tab
          key="load"
          title={
            <div className="flex items-center space-x-2">
              <Analytics />
              <span>Voucher Analytics</span>
            </div>
          }
        >
          <Card>
            <CardBody className="dark:bg-slate-900">
              <ListVoucher />
            </CardBody>
          </Card>
        </Tab>
        <Tab
          key="Usage"
          title={
            <div className="flex items-center space-x-2">
              <DataUsage />
              <span>Usage Analytics</span>
            </div>
          }
        >
          <Card>
            <CardBody className="dark:bg-slate-900">
              <UsedVoucherList />
            </CardBody>
          </Card>
        </Tab>
      </Tabs>
    </div>
  );
}
