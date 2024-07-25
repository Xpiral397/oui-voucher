import type { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";
import axios from "axios";

type Data = {
  status: string;
  message?: string;
  data?: any;
};

export async function POST(req: any, ress: NextApiResponse<Data>) {
  // res.setHeader("Access-Control-Allow-Origin", "*");
  // res.setHeader("Access-Control-Allow-Methods", "POST");
  // res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    NextResponse.json(
      { status: "ok" },
      {
        status: 200,
      }
    );
  }

  console.log(req.method, 0);
  if (req.method === "POST") {
    const { secretKey, user, amount } = await req.json();
    console.log(secretKey, user, amount, req);

    try {
      const response = await axios.post(
        "https://api.paystack.co/transaction/initialize",
        {
          email: user.email,
          amount: amount * 100, // Convert to kobo
          reference: `ref_${Math.floor(Math.random() * 1000000000)}`, // Generate a random reference
        },
        {
          headers: {
            Authorization: `Bearer ${secretKey}`,
            "Content-Type": "application/json",
          },
        }
      );
      return NextResponse.json(response.data, {
        status: 200,
      });
    } catch (error) {
      return NextResponse.json(
        { status: "error", message: error as string },
        {
          status: 200,
        }
      );
    }
  } else {
    return NextResponse.json(
      { status: "error method not allow" },
      {
        status: 200,
      }
    );
  }
}
