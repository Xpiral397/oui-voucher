"use client";
import {
  Code,
  Image,
  Input,
  Select,
  Selection,
  SelectItem,
} from "@nextui-org/react";
import React, { useContext, useEffect, useState } from "react";
import Logo from "@/public/logo.png";
import Books from "@/public/books.jpg";
import {
  Call,
  CastForEducationOutlined,
  DisabledByDefault,
  Email,
  Lock,
  Password,
  Person,
  Token,
} from "@mui/icons-material";
import { Department } from "./config";
import { Step } from "@mui/material";
import { Button } from "@nextui-org/button";
import { Yaldevi } from "next/font/google";
import { error } from "console";

import { useRouter } from "next/navigation";
import { getUser, Login } from "@/app/controller/auth/auth";
import { toast } from "react-toastify";
import { useUserContext } from "@/contexts/users/userUser";
import { User, useUserPaylaod } from "@/contexts/types";

const Years = Array.from(
  { length: 5 },
  (_, i) => new Date().getFullYear() + i,
  toString()
);

export default function SiginCar() {
  const router = useRouter();
  const [faculty, setFaculty] = useState<string>("");
  const [Name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [tel, setTel] = useState<string>("");
  const [matric, setMatric] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [department, setDepartment] = useState<string>("");
  const [has_graduate, setHasGraduate] = useState<boolean>();
  const [level, setLevel] = useState<string>("");
  const [expected, yearOfGraduation] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [re_password, setRePassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [has, setHas] = useState<boolean>(false);
  const { user, setUser } = useContext<useUserPaylaod>(useUserContext);
  const [disabled, setDisabled] = useState<boolean>(false);
  const [error, setError] = useState<any>({
    Name: "",
    Matric: "",
    Tel: "",
    Email: "",
    Password: "",
    RePassword: "",
    Faculty: "",
    Gender: "",
    Department: "",
    Expected: "",
    Level: "",
  });



  useEffect(() => {
    if (user && !user.matric_number
    ) {
      router.push("/login");
    }
    if (has) {
      setError((prevError: any) => ({
        ...prevError,
        Name: !Name.length ? "Name is required" : "",
        Matric: !matric ? "Matric is required" : "",
        Tel: !tel ? "Mobile number is required" : "",
        Email: !email ? "Email is required" : "",
        Faculty: !faculty ? "Faculty is required" : "",
        Department: !department ? "Department is required" : "",
        Gender: !gender ? "Gender is required" : "",
        Expected: !expected ? "Expected field is required" : "",
        Level: !level ? "Level is required" : "",
        Password:
          password && password.length < 5
            ? "Password must be at least 5 characters"
            : password && password.length > 5
              ? ""
              : "Password must be at least 5 characters",
        RePassword: re_password !== password ? "Passwords do not match" : "",
      }));
    }

    // setDisabled(false);
    // setLoading(false);
  }, [
    user,
    Name,
    loading,
    disabled,
    matric,
    tel,
    email,
    faculty,
    department,
    gender,
    expected,
    level,
    password,
    re_password,
  ]);

  const signup = async (matric_number: string, password: string) => {
    setLoading(true);
    const response = await Login({
      matric_number: matric,
      password: password,
    });
    console.log(response);
    if (response !== 500 && response !== 403) {
      toast("Login Successful", {
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
      setUser((user) => {
        return response.user as User;
      });
      router.push("/dashboard");
    } else {
      toast("Login Failed, Your matric_number and your password did't match ", {
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
  };

  return (
    <div className="flex items-center justify-center md:justify-between h-full w-full  flex-col md:flex-row rounded-md shadow-lg bg-gradient-to-br from-amber-50 dark:from-slate-900 via-blue-50 dark:via-slate-950 to-transparent">
      <div className="flex justify-between w-full flex-col">
        <div className="  space-y-1 bg-clip-text text-transparent bg-gradient-to-r text-center from-purple-80  via-orange-600 to-blue-500  font-sans font-[700] text-3xl lg:text-6xl tracking-wider">
          <p>Welcome Back</p>
          <p>Login to Continue</p>
        </div>
        <div className="text-center text-blue-500 dark:text-gray-300 font-[500]">
          <h1 className="mt-10 space-x-2 bg-purpe-400">
            <p> Don't have an account? </p>
            <span>
              <a className="text-underline" href="/auth/signup">
                Create one here
              </a>
            </span>
          </h1>
        </div>
      </div>
      <div className="flex justify-between items-center w-full">
        {/* <Image src={Books.src} className="lg:flex hidden w-[500px]" /> */}
        <div className="mx-auto md:min-w-[500px] h-full rounded-lg shadow-md  dark:bg-gray-900 flex flex-col px-4 py-5">
          <div className="flex items-center space-x-4">
            <div className="w-full">
              <p className="w-full font-[400] shadow-md  dark:bg-gray-800 rounded-lg py-4 px-2 text-blue-900 dark:text-gray-500">
                Payment Management Vocher System
                <p className="font-[400] text-sm text-blue-900 dark:text-gray-200">
                  Oduduwa University
                </p>
              </p>
            </div>
          </div>
          <div className="flex items-center justify-center w-full">
            <form className="w-full md:w-[450px] space-y-10 mt-10">
              <div className="flex flex-col justify-center w-full space-y-3">
                <div>
                  <label
                    className="text-blue-600 dark:text-gray-200 font-[700] text-[14px]"
                    htmlFor="name"
                  >
                    Matric No *
                  </label>
                  <Input
                    classNames={{
                      inputWrapper:
                        "font-[700] border border-blue-300 dark:border-gray-500 focus:outline-none",
                    }}
                    onChange={(e) => setMatric(e.target.value)}
                    isInvalid={error.Matric != ""}
                    errorMessage={error.Matric}
                    variant="bordered"
                    color="default"
                    startContent={<Token color="primary" />}
                    type="text"
                  />
                </div>

                <div>
                  <label
                    className="text-blue-600 dark:text-gray-200 font-[700] text-[14px]"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <Input
                    classNames={{
                      inputWrapper:
                        "border border-blue-300 dark:border-gray-500 focus:outline-none",
                    }}
                    variant="bordered"
                    onChange={(e) => setPassword(e.target.value)}
                    errorMessage={error.Password}
                    isInvalid={error.Password != ""}
                    startContent={<Lock color="primary" />}
                    type="password"
                  />
                </div>
              </div>
              <Button
                onClick={() => {
                  // setLoading(true);
                  setHas(true);
                  setDisabled(true);

                  if (!error.matric && !error.password && matric && password) {
                    signup(matric, password);
                  }
                }}
                variant="bordered"
                // disabled={disabled}
                isLoading={loading}
                className="bg-blue-700 dark:bg-gray-500 w-full text-white font-[700]"
              >
                Sign Up
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
