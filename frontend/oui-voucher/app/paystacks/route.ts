import { base } from "@/base";
import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { AdminToken, getToken } from "../controller/auth/auth";
import { AltRoute, Email } from "@mui/icons-material";
import { headers } from "next/headers";
import { toast } from "react-toastify";

export default async function initalize(req: {
  secretKey: string;
  user: any;
  amount: string;
}) {
  const { secretKey, user, amount } = req;

  try {
    if (localStorage.getItem("last_transaction_ref")) {
      toast.error("Your haven't confirm your last transaction");
      return {};
    }
    // alert(user.email);
    const response = await fetch("/api/paystacks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ secretKey, user, amount }),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const res = await response.json();
    console.log(res, "hhhdhdhdh");
    const { reference, authorization_url, access_code } = res.data;

    localStorage.setItem("last_transaction_ref", reference);
    localStorage.setItem("last_transaction_url", authorization_url);
    console.log(res);
    const ref_response = await axios.post(
      `${base}/voucher/ref/`,
      {
        reference,
        email: user.email,
        matric_number: user.matric_number,
        success: false, // Generate a random reference
      },
      {
        headers: {
          Authorization: `Token ${getToken("Admin")}`,
        },
      }
    );
    if (ref_response.status === 201) {
      return { authorization_url };
    }
  } catch (error) {
    return error;
  }
}

export async function verifyLatPaymentReference(reference: string) {
  try {
    const ref_response = await axios.post(
      `${base}/voucher/fundaccount/`,
      { reference },
      {
        method: "POST",
        headers: {
          Authorization: `Token ${getToken("Admin")}`,

          "Content-Type": "application/json",
        },
      }
    );
    if (ref_response.status == 201 || ref_response.status == 200) {
      // localStorage.removeItem()
      return 200;
    } else {
      return 500;
    }
  } catch (error) {
    return 500;
  }
}
