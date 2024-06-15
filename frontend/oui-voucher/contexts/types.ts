interface User {
  surname: string;
  othername: string;
  other_name?: string;
  name: string;
  email: string;
  matric_number: string;
  telephone: string;
  faculty: string;
  department: string;
  gender: "MALE" | "FEMALE" | "Male" | "Female";
  password?: string;
  re_password?: string;
  processing: false;
  level: string;
  graduation: string;
}

interface useUserPaylaod {
  user: User | null;
  setUser: (user: (user: User | null) => User | null) => void;
}

interface Balance {
  balance: Balance;
  witness: string;
}

export interface Settings {
  sidebar: boolean;
  currentUrl: string;
}

export interface useSettingsPayLaod {
  setting: Settings | null;
  setSettings: (
    settings: (settings: Settings | null) => Settings | null
  ) => void;
}
export type { User, useUserPaylaod };
