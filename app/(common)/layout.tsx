import Footer from "@/components/shared/Footer/Footer";
import Header from "@/components/shared/NavBar/Header";
import { ReactNode } from "react";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Header />
      <main className="h-full min-h-[calc(100vh-0px)]">{children}</main>
      <Footer />
    </>
  );
};

export default layout;
