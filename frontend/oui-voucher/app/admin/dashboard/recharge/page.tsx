"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import axios from "axios";
import { User } from "@/contexts/types"; // Import the User type
import { base } from "@/base";
import { getToken } from "@/app/controller/auth/auth";
import { Card, CardBody, Tab, Tabs } from "@nextui-org/react";
import { Payment, Verified } from "@mui/icons-material";
// import { RechargeAccount } from "@/app/dashboard/recharge/page";

// export function RechargePage() {
//   const [amount, setAmount] = useState("");
//   const [matricNumber, setMatricNumber] = useState("");
//   const [access_code, setAccessCode] = useState("");
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [userExists, setUserExists] = useState(false);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [user, setUser] = useState<User | null>(null);
//   const [paymentMethod, setPaymentMethod] = useState("");
//   const router = useRouter();

//   const priceOptions = [5000, 10000, 20000, 50000, 100000, 500000];

//   const handleAmountChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     setAmount(e.target.value);
//   };

//   const handleMatricNumberChange = async (
//     e: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     const matric = e.target.value;
//     setMatricNumber(matric);

//     if (matric.length >= 8) {
//       try {
//         console.log(base);
//         const response = await fetch(`${base}/accounts/get/user/`, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Token ${getToken() ?? ""}`,
//           },
//           body: JSON.stringify({ matric_number: matric }),
//         });
//         const data = await response.json();
//         setAccessCode(data.access_code);
//         if (response.ok) {
//           setUserExists(true);
//           setAccessCode(data.access_code);
//           setUser(data);
//         } else {
//           setUserExists(false);
//           toast.error("User not found");
//         }
//       } catch (error) {
//         setUserExists(false);
//         toast.error("Error verifying user");
//       }
//     } else {
//       setUserExists(false);
//     }
//   };

//   const handleVerifyUser = async () => {
//     if (!userExists) {
//       toast.error("User not found");
//       return;
//     }
//     // Handle additional verification if needed
//   };

//   const handlePaymentMethodChange = (
//     e: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     setPaymentMethod(e.target.value);
//   };

//   const handlePay = async () => {
//     if (!userExists || !amount || !paymentMethod) {
//       toast.error("Please complete all fields");
//       return;
//     }

//     setIsProcessing(true);
//     try {
//       const response =
//         paymentMethod === "card"
//           ? await axios.post("/api/paystacks", {
//               secretKey: "sk_test_910739f0f2b5a9929339eeec0a11203923f31927",
//               user: {
//                 email: user?.email,
//                 matric_number: matricNumber,
//                 phone_number: phoneNumber,
//               },
//               amount: amount,
//             })
//           : await axios.post(`${base}/pay-or-user/`, {
//               matric_number: matricNumber,
//               email: user?.email, // Adjust based on user context
//               amount: amount,
//             });

//       if (response.status === 200) {
//         if (paymentMethod === "card") {
//           const { authorization_url, access_code } = response.data.data;
//           toast.success("Access code created successfully");
//           setAccessCode(access_code);
//         } else {
//           toast.success("Voucher loaded successfully!", {
//             position: "bottom-center",
//             autoClose: 50000,
//             hideProgressBar: false,
//             closeOnClick: true,
//             pauseOnHover: true,
//             draggable: true,
//             progress: undefined,
//           });
//           // Additional actions if needed
//         }
//       }
//     } catch (error) {
//       toast.error("Payment failed");
//     } finally {
//       setIsProcessing(false);
//     }
//   };

// export function RechargePage() {
//   const [amount, setAmount] = useState("");
//   const [matricNumber, setMatricNumber] = useState("");
//   const [access_code, setAccessCode] = useState("");
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [userExists, setUserExists] = useState(false);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [user, setUser] = useState<User | null>(null);
//   const [paymentMethod, setPaymentMethod] = useState("card");
//   const [sessionID, setSessionID] = useState("");
//   const [bank, setBank] = useState("");
//   const router = useRouter();

//   const priceOptions = [5000, 10000, 20000, 50000, 100000, 500000];

//   const handleAmountChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     setAmount(e.target.value);
//   };

//   const handleMatricNumberChange = async (
//     e: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     const matric = e.target.value;
//     setMatricNumber(matric);

//     if (matric.length >= 8) {
//       try {
//         const response = await fetch(`${base}/accounts/get/user/`, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Token ${getToken() ?? ""}`,
//           },
//           body: JSON.stringify({ matric_number: matric }),
//         });
//         const data = await response.json();
//         // setAccessCode(data.access_code);
//         if (response.ok) {
//           setUserExists(true);
//           // setAccessCode(data.access_code);
//           setUser(data);
//         } else {
//           setUserExists(false);
//           toast.error("User not found");
//         }
//       } catch (error) {
//         setUserExists(false);
//         toast.error("Error verifying user");
//       }
//     } else {
//       setUserExists(false);
//     }
//   };

//   const handleVerifyUser = async () => {
//     if (!userExists) {
//       toast.error("User not found");
//       return;
//     }
//     // Handle additional verification if needed
//   };

//   const handlePaymentMethodChange = (
//     e: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     setPaymentMethod(e.target.value);
//   };

//   const handlePay = async () => {
//     if (!userExists || !amount || !paymentMethod) {
//       toast.error("Please complete all fields");
//       return;
//     }

//     setIsProcessing(true);
//     try {
//       const response =
//         paymentMethod === "card"
//           ? await axios.post("/api/paystacks", {
//               secretKey: "sk_test_910739f0f2b5a9929339eeec0a11203923f31927",
//               user: {
//                 email: user?.email,
//                 matric_number: matricNumber,
//                 phone_number: phoneNumber,
//               },
//               amount: amount,
//             })
//           : await axios.post(`/api/pay-or-user/`, {
//               matric_number: matricNumber,
//               email: user?.email, // Adjust based on user context
//               amount: amount,
//               session_id: sessionID,
//               bank: bank,
//             });

//       if (response.status === 200) {
//         if (paymentMethod === "card") {
//           const { authorization_url, access_code } = response.data.data;
//           toast.success("Access code created successfully");
//           setAccessCode(access_code);
//         } else {
//           toast.success("Voucher loaded successfully!", {
//             position: "bottom-center",
//             autoClose: 5000,
//             hideProgressBar: false,
//             closeOnClick: true,
//             pauseOnHover: true,
//             draggable: true,
//             progress: undefined,
//           });
//         }
//       }
//     } catch (error) {
//       toast.error("Payment failed");
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-r from-white to-purple-50 dark:bg-slate-900">
//       <h1 className="mb-8 text-4xl font-bold text-slate-900 dark:text-white">
//         Recharge Your Account
//       </h1>
//       <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg dark:bg-slate-800">
//         <select
//           value={amount}
//           onChange={handleAmountChange}
//           className="w-full p-4 mb-4 bg-gray-100 border rounded-lg dark:bg-slate-700 dark:text-white"
//         >
//           <option value="">Select Amount</option>
//           {priceOptions.map((price) => (
//             <option key={price} value={price}>
//               NGN {price.toLocaleString()}
//             </option>
//           ))}
//         </select>
//         <input
//           type="text"
//           value={matricNumber}
//           onChange={handleMatricNumberChange}
//           placeholder="Matric Number"
//           className="w-full p-4 mb-4 bg-gray-100 border rounded-lg dark:bg-slate-700 dark:text-white"
//         />
//         <input
//           type="text"
//           value={phoneNumber}
//           onChange={(e) => setPhoneNumber(e.target.value)}
//           placeholder="Phone Number"
//           className="w-full p-4 mb-4 bg-gray-100 border rounded-lg dark:bg-slate-700 dark:text-white"
//         />
//         {userExists && user && (
//           <div className="flex justify-between mb-4 space-x-2 text-center text-green-600">
//             <input
//               type="text"
//               value={user.other_name}
//               disabled
//               className="w-full p-4 mb-4 bg-gray-100 border rounded-lg dark:bg-slate-700 dark:text-white"
//             />
//             <input
//               type="text"
//               value={user.email}
//               disabled
//               className="w-full p-4 mb-4 bg-gray-100 border rounded-lg dark:bg-slate-700 dark:text-white"
//             />
//           </div>
//         )}
//         <div className="mb-4">
//           <label className="inline-flex items-center mr-4">
//             <input
//               type="radio"
//               value="card"
//               checked={paymentMethod === "card"}
//               onChange={handlePaymentMethodChange}
//               className="form-radio"
//             />
//             <span className="ml-2">Pay with Card</span>
//           </label>
//           <label className="inline-flex items-center">
//             <input
//               type="radio"
//               value="voucher"
//               checked={paymentMethod === "voucher"}
//               onChange={handlePaymentMethodChange}
//               className="form-radio"
//             />
//             <span className="ml-2">Load Voucher</span>
//           </label>
//         </div>

//         {paymentMethod === "voucher" && (
//           <>
//             <input
//               type="text"
//               value={sessionID}
//               onChange={(e) => setSessionID(e.target.value)}
//               placeholder="Session ID"
//               className="w-full p-4 mb-4 bg-gray-100 border rounded-lg dark:bg-slate-700 dark:text-white"
//             />
//             <select
//               value={bank}
//               onChange={(e) => setBank(e.target.value)}
//               className="w-full p-4 mb-4 bg-gray-100 border rounded-lg dark:bg-slate-700 dark:text-white"
//             >
//               <option value="">Select Bank</option>
//               <option value="Zenith">Zenith Bank</option>
//               <option value="Wema">Wema Bank</option>
//             </select>
//           </>
//         )}

//         {access_code && (
//           <>
//             <label className="inline-flex items-center mr-4">
//               <span className="ml-2">Generated Access Code</span>
//             </label>
//             <input
//               type="text"
//               disabled
//               value={access_code}
//               className="w-full p-4 mb-4 font-[Helvetica, sans-serif, os-apple] text-pretty tracking-wider text-2xl bg-gray-100 border rounded-lg dark:bg-slate-700 dark:text-white"
//             />
//           </>
//         )}

//         <button
//           onClick={handlePay}
//           className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
//         >
//           {isProcessing ? "Processing..." : "Pay Now"}
//         </button>
//       </div>
//     </div>
//   );
// }

export function RechargePage() {
  const [amount, setAmount] = useState("");
  const [matricNumber, setMatricNumber] = useState("");
  const [access_code, setAccessCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [userExists, setUserExists] = useState(false);
  const [token, setToken] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [sessionID, setSessionID] = useState("");
  const [bank, setBank] = useState("");
  const router = useRouter();

  const priceOptions = [5000, 10000, 20000, 50000, 100000, 500000];

  const handleAmountChange = (e: any) => {
    setAmount(e.target.value);
  };

  const handleMatricNumberChange = async (e: any) => {
    const matric = e.target.value;
    setMatricNumber(matric);

    if (matric.length >= 8) {
      try {
        const response = await fetch(`${base}/accounts/get/user/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${getToken("Admin") ?? ""}`,
          },
          body: JSON.stringify({ matric_number: matric }),
        });
        const data = await response.json();
        if (response.ok) {
          setUserExists(true);
          setUser(data);
          toast.success("User fetched sucessfully");
        } else {
          setUserExists(false);
        }
      } catch (error) {
        setUserExists(false);
        toast.error("Error verifying user");
      }
    } else {
      setUserExists(false);
    }
  };

  const handleVerifyUser = async () => {
    if (!userExists) {
      toast.error("User not found");
      return;
    }
  };

  const handlePaymentMethodChange = (e: any) => {
    setPaymentMethod(e.target.value);
  };

  const handlePay = async () => {
    if (!userExists || !amount || !paymentMethod) {
      toast.error("Please complete all fields");
      return;
    }

    setIsProcessing(true);
    try {
      const response = await axios.post(
        `${base}/voucher/create-payments/`,
        {
          amount: amount,
          student: user?.id, // Assuming user object contains an id field
          payment_sessionId: sessionID,
          email: user?.email,
          bank_used: bank,
          generated_voucher: access_code,
          payment_method: paymentMethod,
        },
        {
          headers: {
            Authorization: `Token ${getToken("Admin") ?? ""}`,
          },
        }
      );

      if (response.status === 201) {
        toast.success("Payment processed successfully");
        setToken(response.data.generated_voucher);
      }
    } catch (error) {
      toast.error("Payment failed");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-r from-white to-purple-50 dark:bg-slate-900">
      <h1 className="mb-8 text-4xl font-bold text-slate-900 dark:text-white">
        Recharge Your Account
      </h1>
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg dark:bg-slate-800">
        <select
          value={amount}
          onChange={handleAmountChange}
          className="w-full p-4 mb-4 bg-gray-100 border rounded-lg dark:bg-slate-700 dark:text-white"
        >
          <option value="">Select Amount</option>
          {priceOptions.map((price) => (
            <option key={price} value={price}>
              NGN {price.toLocaleString()}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={matricNumber}
          onChange={handleMatricNumberChange}
          placeholder="Matric Number"
          className="w-full p-4 mb-4 bg-gray-100 border rounded-lg dark:bg-slate-700 dark:text-white"
        />
        <input
          type="text"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="Phone Number"
          className="w-full p-4 mb-4 bg-gray-100 border rounded-lg dark:bg-slate-700 dark:text-white"
        />
        {userExists && user && (
          <div className="flex justify-between mb-4 space-x-2 text-center text-green-600">
            <input
              type="text"
              value={user?.other_name}
              disabled
              className="w-full p-4 mb-4 bg-gray-100 border rounded-lg dark:bg-slate-700 dark:text-white"
            />
            <input
              type="text"
              value={user?.email}
              disabled
              className="w-full p-4 mb-4 bg-gray-100 border rounded-lg dark:bg-slate-700 dark:text-white"
            />
          </div>
        )}
        <div className="mb-4">
          <label className="inline-flex items-center mr-4">
            <input
              type="radio"
              value="card"
              checked={paymentMethod === "card"}
              onChange={handlePaymentMethodChange}
              className="form-radio"
            />
            <span className="ml-2">Pay with Card</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              value="voucher"
              checked={paymentMethod === "voucher"}
              onChange={handlePaymentMethodChange}
              className="form-radio"
            />
            <span className="ml-2">Load Voucher</span>
          </label>
        </div>

        {paymentMethod === "voucher" && (
          <>
            <input
              type="text"
              value={sessionID}
              onChange={(e) => setSessionID(e.target.value)}
              placeholder="Session ID"
              className="w-full p-4 mb-4 bg-gray-100 border rounded-lg dark:bg-slate-700 dark:text-white"
            />
            <select
              value={bank}
              onChange={(e) => setBank(e.target.value)}
              className="w-full p-4 mb-4 bg-gray-100 border rounded-lg dark:bg-slate-700 dark:text-white"
            >
              <option value="">Select Bank</option>
              <option value="Zenith">Zenith Bank</option>
              <option value="Wema">Wema Bank</option>
            </select>
          </>
        )}

        {access_code && (
          <>
            <label className="inline-flex items-center mr-4">
              <span className="ml-2">Generated Access Code</span>
            </label>
            <input
              type="text"
              disabled
              value={access_code}
              className="w-full p-4 mb-4 font-[Helvetica, sans-serif, os-apple] text-pretty tracking-wider text-2xl bg-gray-100 border rounded-lg dark:bg-slate-700 dark:text-white"
            />
          </>
        )}

        {token && (
          <>
            <label className="inline-flex items-center mr-4">
              <span className="ml-2">Generated Token</span>
            </label>
            <input
              type="text"
              disabled
              value={token}
              className="w-full p-4 mb-4 font-[Helvetica, sans-serif, os-apple] text-pretty tracking-wider text-sm bg-gray-100 border rounded-lg dark:bg-slate-700 dark:text-white"
            />
          </>
        )}

        <button
          onClick={handlePay}
          className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          {isProcessing ? "Processing..." : "Pay Now"}
        </button>
      </div>
    </div>
  );
}

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-r from-white to-purple-50 dark:bg-slate-900">
//       <h1 className="mb-8 text-4xl font-bold text-slate-900 dark:text-white">
//         Recharge Your Account
//       </h1>
//       <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg dark:bg-slate-800">
//         <select
//           value={amount}
//           onChange={handleAmountChange}
//           className="w-full p-4 mb-4 bg-gray-100 border rounded-lg dark:bg-slate-700 dark:text-white"
//         >
//           <option value="">Select Amount</option>
//           {priceOptions.map((price) => (
//             <option key={price} value={price}>
//               NGN {price.toLocaleString()}
//             </option>
//           ))}
//         </select>
//         <input
//           type="text"
//           value={matricNumber}
//           onChange={handleMatricNumberChange}
//           placeholder="Matric Number"
//           className="w-full p-4 mb-4 bg-gray-100 border rounded-lg dark:bg-slate-700 dark:text-white"
//         />
//         <input
//           type="text"
//           value={phoneNumber}
//           onChange={(e) => setPhoneNumber(e.target.value)}
//           placeholder="Phone Number"
//           className="w-full p-4 mb-4 bg-gray-100 border rounded-lg dark:bg-slate-700 dark:text-white"
//         />
//         {userExists && user && (
//           <div className="flex justify-between mb-4 space-x-2 text-center text-green-600">
//             <input
//               type="text"
//               value={user.other_name}
//               disabled
//               // onChange={handleMatricNumberChange}
//               // placeholder="Matric Number"
//               className="w-full p-4 mb-4 bg-gray-100 border rounded-lg dark:bg-slate-700 dark:text-white"
//             />
//             <input
//               type="text"
//               value={user.email}
//               disabled
//               // onChange={handleMatricNumberChange}
//               // placeholder="Matric Number"
//               className="w-full p-4 mb-4 bg-gray-100 border rounded-lg dark:bg-slate-700 dark:text-white"
//             />
//           </div>
//         )}
//         <div className="mb-4">
//           <label className="inline-flex items-center mr-4">
//             <input
//               type="radio"
//               value="card"
//               checked={paymentMethod === "card"}
//               onChange={handlePaymentMethodChange}
//               className="form-radio"
//             />
//             <span className="ml-2">Pay with Card</span>
//           </label>
//           <label className="inline-flex items-center">
//             <input
//               type="radio"
//               value="voucher"
//               checked={paymentMethod === "voucher"}
//               onChange={handlePaymentMethodChange}
//               className="form-radio"
//             />
//             <span className="ml-2">Load Voucher</span>
//           </label>
//         </div>

//         {access_code && (
//           <>
//             {" "}
//             <label className="inline-flex items-center mr-4">
//               <span className="ml-2">Generated Access Code</span>
//             </label>
//             <input
//               type="text"
//               disabled
//               value={access_code}
//               // onChange={(e) => setPhoneNumber(e.target.value)}
//               placeholder="Phone Number"
//               className="w-full p-4 mb-4 font-[Helvetica, sans-serif, os-apple] text-pretty tracking-wider text-2xl bg-gray-100 border rounded-lg dark:bg-slate-700 dark:text-white"
//             />
//           </>
//         )}

//         <button
//           onClick={handlePay}
//           className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
//         >
//           {isProcessing ? "Processing..." : "Pay Now"}
//         </button>
//       </div>
//     </div>
//   );
// }

export default function Page() {
  return (
    <div className="flex flex-col w-full p-4 font-[Helvtica] tracking-wide text-warning-foreground">
      <Tabs aria-label="Options" color="primary" variant="bordered">
        <Tab
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
              <RechargePage />
            </CardBody>
          </Card>
        </Tab>
        <Tab
          key="load"
          title={
            <div className="flex items-center space-x-2">
              <Verified />
              <span>Load My Voucher</span>
            </div>
          }
        >
          <Card>
            <CardBody className="dark:bg-slate-900">
              <></>
            </CardBody>
          </Card>
        </Tab>
      </Tabs>
    </div>
  );
}
