import { base } from "@/base";

export function getToken() {
  return localStorage.getItem(Token);
}

export async function createNewVoucher(payload: any) {
  return await fetch(`${base}/voucher/create-voucher/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${getToken()}`,
    },
    body: JSON.stringify(payload),
  });
}

export async function fetchAllVoucher() {
  try {
    return await fetch(`${base}/voucher/get-all-vouchers/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Token ${getToken()}`,
      },
    });
  } catch (e: any) {
    return 500;
  }
}

export async function fetchUserByMatricNumber(matric_id: string) {
  try {
    return await fetch(`${base}/accounts/get/user/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Token ${getToken()}`,
      },
      body: JSON.stringify({ id: matric_id }),
    });
  } catch (e: any) {
    return 500;
  }
}

export const Token = "TOKEN:DATA:VCH";
export async function Login(loginForm: LoginForm) {
  try {
    const res = await fetch(`${base}/auth/token/login/`, {
      headers: {
        "Content-type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(loginForm),
    });
    if (res.ok) {
      const auth_token = await res.json();
      localStorage.setItem(Token, auth_token.auth_token);
      try {
        const res2 = await fetch(`${base}/auth/users/me/`, {
          headers: {
            "Content-type": "application/json",
            Authorization: `Token ${auth_token.auth_token}`,
          },
          method: "GET",
        });
        if (res.ok) {
          return { user: await res2.json() };
        } else {
          return 403;
        }
      } catch (e) {
        console.log(e);
        return 500;
      }
    } else {
      return 403;
    }
  } catch (e) {
    return 500;
  }
}

export async function Signup(signupForm: SignupForm) {
  return;
}

export async function getUser(accessToken: string) {}
