import { ReactNode } from "react";

export default function SiginCardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex  w-full h-full  justify-center items-center  ">
      {children}
    </div>
  );
}
