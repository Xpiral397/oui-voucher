import { base } from "@/base";
import { ok } from "assert";

export async function SignupUser({
  email,
  password,
  is_student,
  surname,
  username,
  other_name,
  matric_number,
  gender,
  graduation,
  level,
  telephone,
  faculty,
  department,
}: {
  email: string;
  password: string;
  is_student: boolean;
  surname: string;
  username: string;
  other_name: string;
  matric_number: string;

  gender: "Male" | "Female";
  graduation: string;
  level: string;
  telephone: string;
  faculty: string;
  department: string;
}) {
  try {
    const res = await fetch(`${base}/auth/users/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        is_student,
        surname,
        username: surname,
        other_name,
        matric_number,
        gender,
        graduation,
        level,
        telephone,
        faculty,
        department,
      }),
    });
    if (res.ok) {
      return { status: 200, message: "Register Sucessfuly" };
    }
    return { status: 400, message: "Registertion Failed" };
  } catch (error) {
    console.log(error);
    return { status: 500, error };
  }
}
