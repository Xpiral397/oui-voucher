interface LoginForm {
  matric_number: string;
  password: string;
}

interface SignupForm {
  number: string;
  surname: string;
  other_name: string;
  password: string;
  re_password: string;
  matric_number: string;
  faculty: string;
  graduation: string;
  email: string;
  department: string;
  level: string;
  gender: "Male" | "Female";
}
