interface User {
  id?: string;
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
  processing?: false;
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

export interface Admin {
  gender: string;
  id: string;
  username: string;
  email: string;
}

export interface useAdminPayLoad {
  admin: Admin | null;
  setAdmin: (user: (admin: Admin | null) => Admin | null) => void;
}
export interface Settings {
  currentUser: Admin;
  sidebar: boolean;
  currentUrl: string;
}

export interface DashBoard {
  balance: string;
  hideBalance: boolean;
  last_refrenceid?: string;
}
export interface useDashBoardPayLaod {
  dashboard: DashBoard | null;
  setDashBoard: (
    dashboard: (dashboard: DashBoard | null) => DashBoard | null
  ) => void;
}
export interface useSettingsPayLaod {
  setting: Settings | null;
  setSettings: (
    settings: (settings: Settings | null) => Settings | null
  ) => void;
}
export type { User, useUserPaylaod };
