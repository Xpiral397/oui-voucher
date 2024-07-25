"use client";
import { Code, Image, Input, Select, SelectItem } from "@nextui-org/react";
import React, { useContext, useEffect, useState } from "react";
import Logo from "@/public/logo.png";
import Books from "@/public/books.jpg";
import { Call, Email, Lock, Person, Token } from "@mui/icons-material";
import { Department } from "./config";
import { Step } from "@mui/material";
import { Button } from "@nextui-org/button";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Signup } from "@/app/controller/auth/auth";
import { SignupUser } from "@/controller/auth/auth";
import { useUserContext } from "@/contexts/users/userUser";
import { useUserPaylaod } from "@/contexts/types";

const Years = Array.from(
  { length: 5 },
  (_, i) => new Date().getFullYear() + i,
  toString()
);

export default function SiginCar() {
  const router = useRouter();
  const { user, setUser } = useContext<useUserPaylaod>(useUserContext);
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
  const [disabled, setDisabled] = useState<boolean>(false);
  const [signning, setSignning] = useState<boolean>(false);
  const [_username, setUsername] = useState<string>("");
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
    username: "",
  });

  useEffect(() => {
    if (user && user.matric_number) {
      router.push("/dashboard/voucher");
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
        username: !_username ? "username is required" : "",
        Password:
          password && password.length < 5
            ? "Password must be at least 5 characters"
            : password && password.length > 5
              ? ""
              : "Password must be at least 5 characters",
        RePassword: re_password !== password ? "Passwords do not match" : "",
      }));
    }
    setDisabled((e) => Object.values(error).every((e) => e == ""));
    // setLoading(false);
  }, [
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
    _username,
    password,
    re_password,
  ]);
  const signupUser = async () => {
    // console.log(Object.values(error).every((e) => e?.length == 0));
    if (!Object.values(error).every((e) => (e as any)?.length == 0))
      toast("Credential were not well filled!", {
        position: "top-right",
        type: "error",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    else {
      setLoading(true);
      const signupUser = (await SignupUser({
        surname: _username,
        username: _username,
        is_student: true,
        other_name: Name,
        matric_number: matric,
        email,
        password,
        department,
        gender: "Male",
        graduation: expected,
        telephone: tel,
        level,
        faculty,
      })) as any;

      console.log(loading, disabled);
      if (signupUser.status == 200) {
        toast(
          "Registration Completed!, 🦄 Wow so easy!, Verify OTP sent to your gmail",
          {
            type: "success",
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
        router.push("/auth/login");
      } else {
        const error = await signupUser.json();
        toast("Registration Failed!", {
          position: "top-right",
          type: "error",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        toast(error[Object.keys(error)[0]][0], {
          type: "error",
          position: "top-right",
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
    }
  };

  return (
    <div className="flex flex-col items-center w-full h-full rounded-lg shadow-xl md:flex-row md:justify-between ">
      <div className="flex flex-col justify-between w-full text-left md:-ml-40">
        <div className="  md:space-y-1 bg-clip-text text-transparent bg-gradient-to-r text-center from-purple-800  via-orange-600 to-blue-500  font-sans font-[700] text-xl h-full lg:text-6xl  tracking-wider">
          <p>Get Started</p>
          <p>Signup Today</p>
        </div>
        <div className="text-center text-blue-500 dark:text-slate-500 dark:text-gray-300 font-[500]">
          <h1 className="mt-10 space-x-2 bg-purpe-400">
            <p> Alredy have an account? </p>
            <span>
              <a className="text-underline" href="/auth/login">
                Login now
              </a>
            </span>
          </h1>
        </div>
      </div>
      <div className="flex flex-col w-full h-full px-3 py-5 rounded-xl dark:bg-gray-900">
        <div className="flex items-center justify-center w-full">
          <form className="mx-auto sm:shadow-2xl p-5 rounded-xl max-w-[300px] lg:max-w-[450px] space-y-10 mt-10">
            <div className="flex flex-col justify-center w-full space-y-3">
              <div className="flex justify-between space-x-1">
                <div>
                  <label
                    className="text-blue-500 dark:text-slate-500 text-sm font-[400]  dark:font-[700]dark:text-slate-400 text-[14px]"
                    htmlFor="name"
                  >
                    Username *
                  </label>
                  <Input
                    onChange={(e) => setUsername(e.target.value)}
                    isInvalid={error.username != ""}
                    errorMessage={error.username}
                    variant="bordered"
                    classNames={{
                      inputWrapper:
                        "dark:border-slate-800 border-blue-50 focus:outline-none",
                      mainWrapper:
                        "text-small focus:outline-none border-transparent focus:border-transparent focus:ring-0",
                    }}
                    startContent={<Person color="inherit" />}
                    type="text"
                  />
                </div>
                <div>
                  <label
                    className="text-blue-500 dark:text-slate-500 text-sm font-[400]  dark:font-[700]dark:text-slate-400 text-[14px]"
                    htmlFor="name"
                  >
                    Name *
                  </label>
                  <Input
                    onChange={(e) => setName(e.target.value)}
                    isInvalid={error.Name != ""}
                    errorMessage={error.Name}
                    variant="bordered"
                    classNames={{
                      inputWrapper:
                        "border border-slate-300 focus:outline-none dark:border-slate-800 border-blue-5",
                      mainWrapper:
                        "text-small focus:outline-none border-transparent focus:border-transparent focus:ring-0",
                    }}
                    startContent={<Person color="inherit" />}
                    type="text"
                  />
                </div>
              </div>
              <div>
                <label
                  className="text-blue-500 dark:text-slate-500 text-sm font-[400]  dark:font-[700]dark:text-slate-400 text-[14px]"
                  htmlFor="name"
                >
                  Matric No *
                </label>
                <Input
                  autoCapitalize="characters"
                  onChange={(e) => setMatric(e.target.value)}
                  isInvalid={error.Matric != ""}
                  errorMessage={error.Matric}
                  classNames={{
                    inputWrapper:
                      "font-[500] font-sans dark:border-slate-800 border-blue-5 dark:border-slate-800 border-blue-5",
                  }}
                  variant="bordered"
                  color="default"
                  startContent={<Token color="inherit" />}
                  type="text"
                />
              </div>
              <div>
                <label
                  className="text-blue-500 dark:text-slate-500 text-sm font-[400]  dark:font-[700]dark:text-slate-400 text-[14px]"
                  htmlFor="name"
                >
                  Tel *
                </label>
                <Input
                  classNames={{
                    inputWrapper:
                      "border border-slate-300 focus:outline-none dark:border-slate-800 border-blue-5",
                  }}
                  onChange={(e) => setTel(e.target.value)}
                  errorMessage={error.Tel}
                  isInvalid={error.Tel != ""}
                  variant="bordered"
                  startContent={<Call color="inherit" />}
                  type="tel"
                />
              </div>
              <div>
                <label
                  className="text-blue-500 dark:text-slate-500 text-sm font-[400]  dark:font-[700]dark:text-slate-400 text-[14px]"
                  htmlFor="name"
                >
                  Email
                </label>
                <Input
                  classNames={{
                    inputWrapper:
                      "border border-slate-300 focus:outline-none dark:border-slate-800 border-blue-5",
                  }}
                  onChange={(e) => setEmail(e.target.value)}
                  variant="bordered"
                  startContent={<Email color="inherit" />}
                  type="name"
                  errorMessage={error.Email}
                  isInvalid={error.Email != ""}
                />
              </div>
              <div className="flex flex-wrap w-full gap-4 md:flex-nowrap">
                <Select
                  variant="bordered"
                  onChange={(e) => setFaculty(e.target.value)}
                  label="Select A Faculty"
                  className="max-w-xs"
                  isRequired
                  errorMessage={error.Faculty}
                  isInvalid={error.Faculty != ""}
                >
                  {Object.keys(Department).map((_faculty) => (
                    <SelectItem key={_faculty} value={_faculty}>
                      {_faculty}
                    </SelectItem>
                  ))}
                </Select>
                <Select
                  variant="bordered"
                  onChange={(e) => setDepartment(e.target.value)}
                  isRequired
                  disabled={faculty?.toString().length === 0}
                  label="Department"
                  placeholder="Select Your Department"
                  className="max-w-xs dark:border-slate-800 border-blue-5"
                  classNames={{
                    innerWrapper:
                      "font-[500] font-sans dark:border-slate-800 border-blue-5",
                  }}
                  errorMessage={error.Department}
                  isInvalid={error.Department != ""}
                >
                  {faculty ? (
                    Object.values(
                      Department[faculty?.toString() as keyof typeof Department]
                    ).map((_departemnt) => (
                      <SelectItem key={_departemnt} value={_departemnt}>
                        {_departemnt}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem key={""} value={""}>
                      Select A Faculty First
                    </SelectItem>
                  )}
                </Select>
              </div>
              <div className="flex w-full space-x-2 ">
                <Select
                  variant="bordered"
                  onChange={(e) => setGender(e.target.value)}
                  label="Gender"
                  className="max-w-xs"
                  isRequired
                  errorMessage={error.Gender}
                  isInvalid={error.Gender != ""}
                >
                  {["Male", "Female"].map((_gender) => (
                    <SelectItem key={_gender} value={_gender}>
                      {_gender}
                    </SelectItem>
                  ))}
                </Select>
                <Select
                  variant="bordered"
                  startContent={<Step />}
                  onChange={(e) => setLevel(e.target.value)}
                  label="Level "
                  className="max-w-xs"
                  errorMessage={error.Level}
                  isInvalid={error.Level != ""}
                  isRequired
                >
                  {["100", "200", "300", "400", "500", "600", "700"].map(
                    (_gender) => (
                      <SelectItem key={_gender} value={_gender}>
                        {_gender}
                      </SelectItem>
                    )
                  )}
                </Select>
                <Select
                  variant="bordered"
                  onChange={(e) => yearOfGraduation(e.target.value)}
                  placeholder=""
                  label="Grad Yr"
                  className="max-w-xs"
                  isRequired
                  errorMessage={error.Expected}
                  isInvalid={error.Expected != ""}
                >
                  {["2024", "2025", "2026", "2027", "2028", "2029", "2030"].map(
                    (_gender) => (
                      <SelectItem key={_gender} value={_gender}>
                        {_gender}
                      </SelectItem>
                    )
                  )}
                </Select>
              </div>
              <div>
                <label
                  className="text-blue-500 dark:text-slate-500 text-sm font-[400]  dark:font-[700]dark:text-slate-400 text-[14px]"
                  htmlFor="password"
                >
                  Password
                </label>
                <Input
                  classNames={{
                    inputWrapper:
                      "border border-slate-300 focus:outline-none dark:border-slate-800 border-blue-50 hover:border-slate-800",
                  }}
                  variant="bordered"
                  onChange={(e) => setPassword(e.target.value)}
                  errorMessage={error.Password}
                  isInvalid={error.Password != ""}
                  startContent={<Lock color="inherit" />}
                  type="password"
                />
              </div>
              <div>
                <label
                  className="text-blue-500 dark:text-slate-500 text-sm font-[400]  dark:font-[700]dark:text-slate-400 text-[14px]"
                  htmlFor="password"
                >
                  Retype Your Password
                </label>
                <Input
                  className="border-none"
                  classNames={{
                    inputWrapper:
                      "border border-slate-300 focus:outline-none dark:border-slate-800 border-blue-50",
                  }}
                  autoComplete="password"
                  onChange={(e) => setRePassword(e.target.value)}
                  variant="bordered"
                  errorMessage={error.RePassword}
                  isInvalid={error.RePassword != ""}
                  type="password"
                  startContent={<Lock color="inherit" />}
                />
              </div>
            </div>
            <Button
              onClick={() => {
                signupUser().finally(() => {
                  setLoading(false);
                });
              }}
              variant="bordered"
              // disabled={disabled}
              isLoading={loading}
              className="dark:bg-slate-900 bg-blue-700 w-full text-white font-[700]  dark:text-slate-100"
            >
              Sign Up
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
