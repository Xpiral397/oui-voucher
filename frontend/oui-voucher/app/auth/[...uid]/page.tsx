"use client";
import { base } from "@/base";
import {
  Check,
  Close,
  MarkAsUnread,
  SmsFailed,
  Warning,
} from "@mui/icons-material";
import { CircularProgress } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function activate(slash: any) {
  let done = false;
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const [success, setSuccess] = useState<boolean>(false);
  console.log(slash);

  useEffect(() => {
    if (!done) {
      (async () => {
        done = true;
        try {
          const res = await fetch(`${base}/auth/users/activation/`, {
            headers: {
              "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify({
              uid: slash?.params.uid[0],
              token: slash?.params.uid[1],
            }),
          });
          if (res.status == 204) {
            setLoading(false);
            setSuccess(true);
            router.push("/auth/login");
            toast("Email confirm successfully", {
              type: "success",
              position: "bottom-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            });
          } else {
            const error = await res.json();

            console.log(error[Object.keys(error)[0]]);
            toast(
              error[Object.keys(error)[0]] === "Stale token for given user."
                ? "Already Register"
                : error[Object.keys(error)[0]][0],
              {
                type: "error",
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
              }
            );
          }
        } catch (error) {
          toast("Uable to reach server", {
            type: "error",
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        }
        setLoading(false);
      })();
    }
  }, []);
  return (
    <div className="h-[87vh] justify-center w-full dark:bg-slate-900 max-w-full mx-auto items-center flex flex-col">
      {loading && (
        <div className="text-secondary-500 dark:text-slate-200 tracking-tighter space-x-3 text-2xl flex items-center  mx-auto">
          <Warning fontSize="large" />
          <h1 className="text-secondary-500 dark:text-slate-200 text-center font-[500] animate-pulse font-sans">
            Please, Hang on while we help you to activate and verified your
            account{" "}
          </h1>
        </div>
      )}
      {loading && (
        <div className="flex space-x-2 -mt-96 mx-auto items-center w-full justify-center ">
          <CircularProgress
            size="lg"
            color="secondary"
            aria-label="activating"
          />
          <h1 className="text-secondary-500 dark:text-slate-200  text-xl">
            Activating
          </h1>
        </div>
      )}
      {!loading &&
        (success ? (
          <div className="text-secondary-500 dark:text-slate-200 items-center  flex space-x-3">
            <div className="bg-slate-100 flex items-center  justify-center dark:bg-slate-800  rounded-full h-16  w-16 shadow-2xl dark:shadow-sm">
              <Check fontSize="large" />
            </div>
            <h1 className="text-secondary-500 dark:text-slate-200  text-xl">
              Account Activated successfully{" "}
            </h1>
          </div>
        ) : (
          <div className="text-secondary-500 items-center  dark:text-slate-200 flex space-x-3">
            <div className="bg-slate-100 flex items-center  justify-center dark:bg-slate-800  rounded-full h-16  w-16 shadow-2xl dark:shadow-sm">
              <Close fontSize="large" />
            </div>
            <h1 className="text-secondary-500 dark:text-slate-200 text-xl">
              Account Activation Failed{" "}
            </h1>
          </div>
        ))}
    </div>
  );
}
