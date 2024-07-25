// import React, { useState } from "react";
// import axios from "axios";
// import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
// import initalize from "@/app/paystacks/route";
// import { Code } from "@nextui-org/code";

// interface PayStackContainerProps {
//   secretKey: string;
//   user: { email: string; matric_number: string };
//   amount: number;
//   setter: any;
// }

// const PayStackContainer: React.FC<PayStackContainerProps> = ({
//   secretKey,
//   setter,
//   user,
//   amount,
// }) => {
//   const [authorizationUrl, setAuthorizationUrl] = useState<string | null>(null);
//   const [isOpen, setIsOpen] = useState(false);

//   const initializeTransaction = async () => {
//     try {
//       const response = (await initalize({ secretKey, user, amount })) as any;
//       console.log(response);

//       if (response !== 500) {
//         setAuthorizationUrl(response.authorization_url);
//         setIsOpen(true);
//         setter(false);
//         console.log("success");
//       } else {
//         alert("Failed To Initialized Your Payment");
//         setIsOpen(false);
//         setter(false);
//       }
//     } catch (error) {
//       console.error("Error initializing transaction:", error);
//       setIsOpen(false);
//     }
//   };

//   return (
//     <div>
//       <button
//         onClick={initializeTransaction}
//         className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none"
//       >
//         Pay Now
//       </button>

//       <Dialog
//         open={isOpen}
//         onClose={() => setIsOpen(false)}
//         className="relative z-10"
//       >
//         <div className="fixed inset-0 bg-opacity-50 dark:bg-black w-lg" />
//         <div className="fixed inset-0 flex items-center justify-center ">
//           <DialogPanel className="w-full max-w-md p-6 bg-white rounded shadow-lg">
//             <DialogTitle className="text-lg font-medium">
//               Complete Your Payment
//             </DialogTitle>
//             <Code> Refresh this page after sucessfull payment </Code>
//             {authorizationUrl && (
//               <button
//                 onClick={initializeTransaction}
//                 className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none"
//               >
//                 <a href={authorizationUrl}>Procced Payment</a>
//               </button>
//             )}
//             <button
//               onClick={() => setIsOpen(false)}
//               className="px-4 py-2 mt-4 text-sm font-medium text-white bg-purple-500 rounded-md hover:bg-purple-600 focus:outline-none"
//             >
//               Close
//             </button>
//           </DialogPanel>
//         </div>
//       </Dialog>
//     </div>
//   );
// };

// export default PayStackContainer;
