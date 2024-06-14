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
  Hostel: <HomeIcon className="w-5 h-5 text-primary-500" color="primary" />,
  Tuition: <School className="w-5 h-5" color="primary" />,
  School: <School className="w-5 h-5" color="primary" />,
  Malpractice: <LocalPolice className="w-5 h-5" color="primary" />,
  Medical: <MedicalServices className="w-5 h-5" color="primary" />,
  "X-ray": <LocalPolice className="w-5 h-5" color="primary" />,
  Practical: <LocalPolice className="w-5 h-5" color="primary" />,
  Other: <LocalPolice className="w-5 h-5" color="primary" />,
};
const predefinedFees: Fee[] = [
  {
    name: "Hostel",
    amount: 100000,
    editable: true,
  },
  {
    name: "Tuition",
    amount: 200000,
    editable: true,
    // icon: <School className="w-5 h-5" color="primary" />,
  },
  {
    name: "School",
    amount: 150000,
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
    name: "Medical",
    amount: 30000,
    editable: true,
    // icon: <MedicalServices className="w-5 h-5" color="primary" />,
  },
  {
    name: "X-ray",
    amount: 20000,
    editable: true,
    // icon: <LocalPolice className="w-5 h-5" color="primary" />,
  },
  {
    name: "Practical",
    amount: 40000,
    editable: true,
    // icon: <LocalPolice className="w-5 h-5" color="primary" />,
  },
  {
    name: "Clearance",
    amount: 25000,
    editable: true,
    // icon: <LocalPolice className="w-5 h-5" color="primary" />,
  },
  {
    name: "Text Books",
    amount: 10000,
    editable: true,
    // icon: <LocalPolice className="w-5 h-5" color="primary" />,
  },
  {
    name: "Departmental",
    amount: 15000,
    editable: true,
    // icon: <LocalPolice className="w-5 h-5" color="primary" />,
  },
  {
    name: "Exemption",
    amount: 50000,
    editable: true,
    // icon: <LocalPolice className="w-5 h-5" color="primary" />,
  },
  // Add more fees as needed
];

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

  const createVoucher = async () => {
    // Validation
    const missingFields: string[] = [];
    if (!voucherName) missingFields.push("Voucher Name");
    if (!dateRange.start) missingFields.push("Start Date");
    if (!dateRange.end) missingFields.push("End Date");
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
    const id = toast.loading("Creating voucher...");

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
        throw new Error("Failed to create voucher. Please try again later.");
      }

      // Voucher created successfully
      toast.dismiss(id);
      toast.success("Voucher created successfully!");

      router.push("/dashboard/voucher/manage");
    } catch (error: any) {
      toast.dismiss(id);
      toast.error(
        error.message ?? "Failed to create voucher. Please try again later."
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
    <div className="bg-white dark:bg-gray-900 min-h-screen p-6">
      <header className="flex justify-between items-center py-4 px-6 bg-white rounded-md shadow-md dark:bg-gray-800">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          Add New Voucher
        </h1>
      </header>

      <main className="flex flex-col items-center mt-10 mx-auto max-w-4xl w-full">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full">
          <div className="w-full flex space-x-0 sm:flex-row flex-col sm:space-x-2">
            <div className="mb-4 w-2/3">
              <label className="block text-gray-700 dark:text-gray-300">
                Voucher Name
              </label>
              <input
                type="text"
                value={voucherName}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setVoucherName(e.target.value)
                }
                className="w-full p-2 mt-2 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600"
              />
            </div>
            <div className="mb-4 w-full">
              <label className="block text-gray-700 dark:text-gray-300">
                Voucher ID
              </label>
              <input
                type="text"
                value={"2GMX6Y782WQTy"}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setVoucherName(e.target.value)
                }
                className="w-full p-2 mt-2 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600"
              />
            </div>
          </div>

          <div className="mb-4 flex space-x-4">
            <div className="flex-1">
              <label className="block text-gray-700 dark:text-gray-300">
                Start Date
              </label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setDateRange({ ...dateRange, start: e.target.value })
                }
                className="w-full p-2 mt-2 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600"
              />
            </div>
            <div className="flex-1">
              <label className="block text-gray-700 dark:text-gray-300">
                End Date
              </label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setDateRange({ ...dateRange, end: e.target.value })
                }
                className="w-full p-2 mt-2 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600"
              />
            </div>
          </div>
          <label className="text-right block text-gray-700 dark:text-gray-300">
            User Credentials
          </label>
          <Divider />

          <div className="mb-5 mt-5 ">
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300">
                Name
              </label>
              <input
                type="text"
                value={name}
                disabled
                className="w-full p-2 mt-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600"
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
                className="w-full p-2 mt-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600"
              />
            </div>
            <div className="flex items-center space-x-3 w-full">
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300">
                  Matriculation Number
                </label>
                <input
                  type="text"
                  value={matricNumber}
                  disabled
                  className="w-full p-2 mt-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600"
                />
              </div>
              <div className="flex items-center space-x-3 w-full">
                <div className="mb-4 w-full">
                  <label className="block text-gray-700 dark:text-gray-300">
                    Department
                  </label>
                  <input
                    type="text"
                    value={department}
                    disabled
                    className="w-full p-2 mt-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600"
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3 w-full">
              <div className="mb-4 w-3/4">
                <label className="block text-gray-700 dark:text-gray-300">
                  Department
                </label>
                <input
                  type="text"
                  value={department}
                  disabled
                  className="w-full p-2 mt-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600"
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
                  className="w-full p-2 mt-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600"
                />
              </div>
              <div className="mb-4 w-1/4">
                <label className="block text-gray-700 dark:text-gray-300">
                  Semester
                </label>
                <Select
                  color={"secondary"}
                  value={Array.from(semester).join("")}
                  onSelectionChange={setSemester}
                  className="w-full p-2 mt-2 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600"
                >
                  <SelectItem key={"1st"} value="">
                    1st Semester
                  </SelectItem>
                  <SelectItem key={"2nd"} value="">
                    2nd Semester
                  </SelectItem>
                </Select>
              </div>
            </div>
          </div>

          <label className="text-right block text-gray-700 dark:text-gray-300">
            Paying for another student?
          </label>
          <Divider />

          <div className="mb-4 mt-5 ">
            <Switch
              checked={isPayingForAnother}
              onChange={() => setIsPayingForAnother(!isPayingForAnother)}
            />
          </div>

          {isPayingForAnother && (
            <div>
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300">
                  External User ID
                </label>
                <div className="mt-3 flex space-x-2 items-center">
                  <input
                    type="text"
                    value={externalUserId}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setExternalUserId(e.target.value)
                    }
                    className="w-full p-2 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600"
                  />
                  <Button
                    color="primary"
                    onClick={handleAddFee}
                    className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-900"
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

          <div className="mb-4">
            <div className="flex items-center space-x-2 mt-2">
              <Select
                // selectedKeys={values}
                color="primary"
                selectionMode="multiple"
                onSelectionChange={setValues}
                placeholder="Select a fee"
                className="flex-1 p-2 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600"
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
                className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-900"
              >
                <PlusIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300">
              Selected Fees
            </label>
            <div className="flex flex-col space-y-4 mt-2">
              {fees.map((fee, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-4 bg-gray-200 dark:bg-gray-700 p-2 rounded-lg"
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
                    disabled={fee.amount > 50000}
                    className="flex-1 p-2 rounded-md bg-white dark:bg-gray-600 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600"
                    placeholder="Enter amount"
                  />
                  <button
                    onClick={() => handleRemoveFee(fee.name)}
                    className="text-red-500 dark:text-red-300 hover:text-red-700 dark:hover:text-red-500"
                  >
                    <XIcon className="h-6 w-6" />
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
              type="text"
              value={totalAmount}
              disabled
              className="w-full p-2 mt-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600"
            />
          </div>
          <label className="text-right mt-3 block text-gray-700 dark:text-gray-300">
            Action & Checks
          </label>
          <Divider />

          <div className="mt-4 mb-4 flex space-x-2 w-full">
            <button
              onClick={calculateTotal}
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-700"
            >
              Calculate Total
            </button>
            <button
              onClick={createVoucher}
              className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-900"
            >
              Create Voucher
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Page;
