import Header from "@/components/shared/NavBar/Header";
import { ReactNode } from "react";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Header />
      <div className="h-full min-h-[calc(100vh-0px)]">{children}</div>
    </>
  );
};

export default layout;
