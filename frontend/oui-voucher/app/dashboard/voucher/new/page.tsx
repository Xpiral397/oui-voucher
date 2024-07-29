"use client";
import React, {
  useState,
  ChangeEvent,
  useEffect,
  ReactNode,
  useContext,
} from "react";
import {
  Divider,
  Switch,
  Select,
  SelectItem,
  Selection,
  Button,
} from "@nextui-org/react";
import { PlusIcon, XIcon } from "@heroicons/react/outline";
import { HomeIcon } from "@heroicons/react/outline";
import { LocalPolice, MedicalServices, School } from "@mui/icons-material";
import { useUserContext } from "@/contexts/users/userUser";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { base } from "@/base";
import {
  createNewVoucher,
  fetchUserByMatricNumber,
  getToken,
} from "@/app/controller/auth/auth";
import { SearchCircleIcon } from "@heroicons/react/outline";
import { SearchIcon } from "@/components/icons";

interface Fee {
  name: string;
  amount: number;
  editable: boolean;
}

const Icon = {
  "Hostel Fee": (
    <HomeIcon className="w-5 h-5 text-primary-500" color="primary" />
  ),
  Tuition: <School className="w-5 h-5" color="primary" />,
  School: <School className="w-5 h-5" color="primary" />,
  Malpractice: <LocalPolice className="w-5 h-5" color="primary" />,
  Medical: <MedicalServices className="w-5 h-5" color="primary" />,
  "X-ray": <LocalPolice className="w-5 h-5" color="primary" />,
  Practical: <LocalPolice className="w-5 h-5" color="primary" />,
  Other: <LocalPolice className="w-5 h-5" color="primary" />,
};

const fetchExternalUserCheck = async (userId: string) => {
  const toast_id = toast.loading("fetching external stundent");
  const fetched_user = await fetchUserByMatricNumber(userId);
  if (fetched_user === 500 || fetched_user.status !== 200) {
    toast.dismiss(toast_id);
    toast.error(`Student with matric number ${userId} not found`);
  } else {
    toast.dismiss(toast_id);
    // toast.error(`Student info fetched successfully`);
    return await fetched_user.json();
  }
};

const fetchExternalUser = async (userId: string) => {
  const fetched_user = await fetchUserByMatricNumber(userId);
  if (fetched_user === 500 || fetched_user.status !== 200) {
    return {};
  } else {
    toast.success(`Student info fetched successfully`);
    return await fetched_user.json();
  }
};

export function Page() {
  const [predefinedFees, setPredefine] = useState<Fee[]>([
    {
      name: "Maye Hostel",
      amount: 98000,
      editable: true,
    },
    {
      name: "Oyetade Hostel",
      amount: 69000,
      editable: true,
    },
    {
      name: "Adeline Hostel",
      amount: 98000,
      editable: true,
    },
    {
      name: "Moremi Hostel",
      amount: 98000,
      editable: true,
    },
    {
      name: "IOA Hostel",
      amount: 69000,
      editable: true,
    },
    {
      name: "Moremi Hostel",
      amount: 98000,
      editable: true,
    },
    {
      name: "Tuition Fee",
      amount: 185000,
      editable: true,
      // icon: <School className="w-5 h-5" color="primary" />,
    },

    {
      name: "Malpractice",
      amount: 50000,
      editable: true,
      // icon: <LocalPolice className="w-5 h-5" color="primary" />,
    },
    {
      name: "Medical Fee",
      amount: 10000,
      editable: true,
      // icon: <MedicalServices className="w-5 h-5" color="primary" />,
    },
    {
      name: "Practical Fee",
      amount: 50000,
      editable: true,
      // icon: <LocalPolice className="w-5 h-5" color="primary" />,
    },

    {
      name: "Exemption Fee",
      amount: 26000,
      editable: true,
      // icon: <LocalPolice className="w-5 h-5" color="primary" />,
    },
  ]);
  const router = useRouter();
  const { user } = useContext(useUserContext);

  const [fees, setFees] = useState<Fee[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [voucherName, setVoucherName] = useState<string>("");
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: "",
    end: "",
  });
  const [encryptVoucher, setEncryptVoucher] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>(
    `${user?.surname} ${user?.othername}`
  );
  const [email, setEmail] = useState<string>(user?.email ?? "");
  const [matricNumber, setMatricNumber] = useState<string>(
    user?.matric_number ?? "??"
  );
  const [level, setLevel] = useState<string>(user?.level ?? "");
  const [department, setDepartment] = useState<string>(user?.department ?? "");
  const [semester, setSemester] = useState<Selection>(new Set([]));
  const [isPayingForAnother, setIsPayingForAnother] = useState<boolean>(false);
  const [externalUserId, setExternalUserId] = useState<string>("");
  const [externalUser, setExternalUser] = useState<any>(null);
  const [values, setValues] = React.useState<Selection>(new Set([]));
  const [newListName, setNewListName] = useState<string>("");
  const [newListAmount, setNewListAmmount] = useState<number>(0);

  useEffect(() => {
    if (isPayingForAnother) {
      setName("");
      setEmail("");
      setMatricNumber("");
      setLevel("");
      setExternalUser(null);
    } else {
      setName(
        `${user?.surname ? user?.surname : ""} ${user?.other_name ? user.other_name : ""}`
      );
      setDepartment(user?.department ?? "");
      setEmail(user?.email ?? "");
      setMatricNumber(user?.matric_number ?? "");
      setLevel(user?.level ?? "");
      setExternalUser(null);
    }
  }, [isPayingForAnother, user]);

  useEffect(() => {
    if (externalUserId) {
      fetchExternalUser(externalUserId).then((user) => {
        console.log(user, "myuser");
        setExternalUser(user);
        setName(
          (user.surname ? user.surname : "") +
            (user.other_name ? user.other_name : "")
        );
        setEmail(user.email);
        setMatricNumber(user.matric_number);
        setLevel(user.level);
      });
    }
  }, [externalUserId]);

  const addNewFee = () => {
    if (newListAmount === 0 || newListName === "") {
      return;
    }
    const key = [];
    for (let fee of predefinedFees) {
      if (newListName === fee.name) {
        toast.error("Fee  Name already exist");
        return;
      }
    }
    setPredefine((e) => [
      ...e,
      ...[{ name: newListName, amount: newListAmount, editable: true }],
    ]);
    toast.success("New fee added successfully");
    setNewListName("");
    setNewListAmmount(0);
  };
  const createVoucher = async () => {
    // Validation
    const missingFields: string[] = [];
    // if (!voucherName) missingFields.push("Voucher Name");
    // if (!dateRange.start) missingFields.push("Start Date");
    // if (!dateRange.end) missingFields.push("End Date");
    if (fees.length === 0) missingFields.push("Fees");
    if (!name) missingFields.push("Name");
    if (!email) missingFields.push("Email");
    if (!matricNumber) missingFields.push("Matriculation Number");
    if (!level) missingFields.push("Level");
    if (!department) missingFields.push("Department");
    if (!semester) missingFields.push("Semester");
    if (isPayingForAnother && !externalUserId)
      missingFields.push("External User ID");

    if (missingFields.length > 0) {
      const errorMessage = `Please fill in all required fields: ${missingFields.join(", ")}.`;
      toast.error(errorMessage, {
        autoClose: 10000,
      });
      return;
    }

    // Processing
    const id = toast.loading("Processing our payment...");

    try {
      // Construct the payload
      const payload = {
        fees,
        totalAmount,
        voucherName,
        dateRange,
        encryptVoucher,
        password,
        name,
        email,
        matricNumber,
        level,
        department,
        semester: Array.from(semester).join(""),
        isPayingForAnother,
        externalUserId,
        externalUser,
        values: Array.from(values), // Convert Set to Array
      };

      // Send the request
      const response = await createNewVoucher(payload);

      if (!response.ok) {
        throw new Error("Failed to create payement. Please try again later.");
      }

      // Voucher created successfully
      toast.dismiss(id);
      toast.success("All the Fees has been paid for  successfully!");

      router.push("/dashboard/voucher/manage");
    } catch (error: any) {
      toast.dismiss(id);
      toast.error(
        error.message ?? "Failed to create payment. Please try again later."
      );
    }
  };

  const handleAddFee = () => {
    if (values) {
      const _fees: (typeof predefinedFees)[0][] = [];
      for (const selectedFee of Array.from(values)) {
        // console.log(selectedFee, "okay");
        const _search = predefinedFees.find((f) => f.name === selectedFee);
        if (_search) {
          console.log(_search, "kop");
          _fees.push(_search);
        }
      }
      setFees([
        ..._fees,
        // {
        // name: fee.name,
        // amount: fee.amount,
        // editable: fee.amount > 50000,
        // },
      ]);

      console.log(fees, Array(values));
    }
  };

  const handleRemoveFee = (feeName: string) => {
    const updatedFees = fees.filter((fee) => fee.name !== feeName);
    setFees(updatedFees);
  };

  const handleAmountChange = (feeName: string, amount: string) => {
    const updatedFees = fees.map((fee) =>
      fee.name === feeName ? { ...fee, amount: parseFloat(amount) || 0 } : fee
    );
    setFees(updatedFees);
  };

  const calculateTotal = () => {
    const total = fees.reduce((sum, fee) => sum + fee.amount, 0);
    setTotalAmount(total);
  };

  useEffect(() => {
    calculateTotal();
  }, [fees]);

  return (
    <div className="min-h-screen p-6 bg-white dark:bg-gray-900">
      <header className="flex items-center justify-between px-6 py-4 bg-white rounded-md shadow-md dark:bg-gray-800">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          Pay New Fee
        </h1>
      </header>

      <main className="flex flex-col items-center w-full max-w-4xl mx-auto mt-10">
        <div className="w-full p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800">
          <div className="flex flex-col w-full space-x-0 sm:flex-row sm:space-x-2"></div>

          <label className="block text-right text-gray-700 dark:text-gray-300">
            User Credentials
          </label>
          <Divider />

          <div className="mt-5 mb-5 ">
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300">
                Name
              </label>
              <input
                type="text"
                value={name}
                disabled
                className="w-full p-2 mt-2 text-gray-900 bg-gray-200 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300">
                Email
              </label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full p-2 mt-2 text-gray-900 bg-gray-200 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
            </div>
            <div className="flex items-center w-full space-x-3">
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300">
                  Matriculation Number
                </label>
                <input
                  type="text"
                  value={matricNumber}
                  disabled
                  className="w-full p-2 mt-2 text-gray-900 bg-gray-200 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
              </div>
              <div className="flex items-center w-full space-x-3">
                <div className="w-full mb-4">
                  <label className="block text-gray-700 dark:text-gray-300">
                    Department
                  </label>
                  <input
                    type="text"
                    value={department}
                    disabled
                    className="w-full p-2 mt-2 text-gray-900 bg-gray-200 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center w-full space-x-3">
              <div className="w-3/4 mb-4">
                <label className="block text-gray-700 dark:text-gray-300">
                  Department
                </label>
                <input
                  type="text"
                  value={department}
                  disabled
                  className="w-full p-2 mt-2 text-gray-900 bg-gray-200 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
              </div>

              <div className="mb-4 1/4">
                <label className="block text-gray-700 dark:text-gray-300">
                  Level
                </label>
                <input
                  type="text"
                  value={level}
                  disabled
                  className="w-full p-2 mt-2 text-gray-900 bg-gray-200 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
              </div>
              <div className="w-3/4 mb-4">
                <label className="block text-gray-700 dark:text-gray-300">
                  Semester
                </label>
                <Select
                  color={"secondary"}
                  value={Array.from(semester).join("")}
                  onSelectionChange={setSemester}
                  className="w-full p-2 mt-2 text-gray-900 bg-white border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
                >
                  <SelectItem key={"1st"} value="">
                    1st
                  </SelectItem>
                  <SelectItem key={"2nd"} value="">
                    2nd
                  </SelectItem>
                </Select>
              </div>
            </div>
          </div>

          {isPayingForAnother && (
            <div>
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300">
                  External User ID
                </label>
                <div className="flex items-center mt-3 space-x-2">
                  <input
                    type="text"
                    value={externalUserId}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setExternalUserId(e.target.value)
                    }
                    className="w-full p-2 text-gray-900 bg-white border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  />
                  <Button
                    color="primary"
                    onClick={handleAddFee}
                    className="px-4 py-2 text-white bg-gray-700 rounded-md hover:bg-gray-900"
                  >
                    <SearchIcon
                      onClick={() => {
                        (async () => {
                          fetchExternalUserCheck(externalUserId).then(
                            (user) => {
                              setExternalUser(user);
                              setDepartment(user?.department);
                              setName(
                                user?.surname ??
                                  "" + " " + user?.other_name ??
                                  ""
                              );
                              setEmail(user?.email);
                              setMatricNumber(user?.matric_number);
                              setLevel(user?.level);
                            }
                          );
                        })();
                      }}
                    />
                  </Button>
                </div>
              </div>
            </div>
          )}
          <label className="block text-right text-gray-700 dark:text-gray-300">
            Select Fee
          </label>
          <Divider />

          <div className="flex mt-3 mb-3 space-x-3">
            <input
              type="name"
              // max={fee.amount}
              value={newListName}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setNewListName(e.target.value)
              }
              // disabled={!(fee.amount > 184000) || fee.name == "other"}
              className="flex-1 p-2 text-gray-900 bg-white border border-gray-300 rounded-md dark:bg-gray-600 dark:text-white dark:border-gray-600"
              placeholder="New Fee Name"
            />
            <input
              type="number"
              // max={fee.amount}
              value={newListAmount}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setNewListAmmount(Number(e.target.value))
              }
              // disabled={!(fee.amount > 184000) || fee.name == "other"}
              className="flex-1 p-2 text-gray-900 bg-white border border-gray-300 rounded-md dark:bg-gray-600 dark:text-white dark:border-gray-600"
              placeholder="New Fee Name"
            />
            <button
              onClick={addNewFee}
              className="px-4 py-2 text-white bg-gray-700 rounded-md hover:bg-gray-900"
            >
              Add New Fee
            </button>
          </div>
          <Divider />
          <div className="mb-4">
            <div className="flex items-center mt-2 space-x-2">
              <Select
                // selectedKeys={values}
                color="primary"
                selectionMode="multiple"
                onSelectionChange={setValues}
                placeholder="Select a fee"
                className="flex-1 p-2 text-gray-900 bg-white border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
              >
                {predefinedFees.map((fee, index) => (
                  <SelectItem
                    startContent={
                      Icon[fee.name as keyof typeof Icon] ?? Icon.Other
                    }
                    key={fee.name}
                  >
                    {fee.name}
                  </SelectItem>
                ))}
              </Select>
              <button
                onClick={handleAddFee}
                className="px-4 py-2 text-white bg-gray-700 rounded-md hover:bg-gray-900"
              >
                <PlusIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300">
              Selected Fees
            </label>
            <div className="flex flex-col mt-2 space-y-4">
              {fees.map((fee, index) => (
                <div
                  key={index}
                  className="flex items-center p-2 space-x-4 bg-gray-200 rounded-lg dark:bg-gray-700"
                >
                  <span className="text-gray-900 dark:text-gray-200">
                    {fee.name}
                  </span>
                  <input
                    type="number"
                    max={fee.amount}
                    value={fee.amount}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleAmountChange(fee.name, e.target.value)
                    }
                    disabled={!(fee.amount > 184000) || fee.name == "other"}
                    className="flex-1 p-2 text-gray-900 bg-white border border-gray-300 rounded-md dark:bg-gray-600 dark:text-white dark:border-gray-600"
                    placeholder="Enter amount"
                  />
                  <button
                    onClick={() => handleRemoveFee(fee.name)}
                    className="text-red-500 dark:text-red-300 hover:text-red-700 dark:hover:text-red-500"
                  >
                    <XIcon className="w-6 h-6" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300">
              Total Amount
            </label>
            <input
              type="text text-secondary-500 font-[500] font-[Helvetica, sans-serif]"
              value={"NGN " + totalAmount.toLocaleString()}
              disabled
              className="w-full p-2 mt-2 text-gray-900 bg-gray-200 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />
          </div>
          <label className="block mt-3 text-right text-gray-700 dark:text-gray-300">
            Action & Checks
          </label>
          <Divider />

          <div className="flex w-full mt-4 mb-4 space-x-2">
            <button
              onClick={calculateTotal}
              className="px-4 py-2 text-white bg-green-500 rounded-md hover:bg-green-700"
            >
              Calculate Total
            </button>
            <button
              onClick={createVoucher}
              className="px-4 py-2 text-white bg-gray-700 rounded-md hover:bg-gray-900"
            >
              Pay Fee
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Page;
