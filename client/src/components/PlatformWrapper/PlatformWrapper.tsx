import React, { ReactNode } from "react";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar";
import Footer from "../Footer/Footer";

interface PlatformWrapperProps {
  children: ReactNode;
}

const PlatformWrapper: React.FC<PlatformWrapperProps> = ({
  children,
}: PlatformWrapperProps) => {
  return (
    <>
      <Navbar />
      <Sidebar />
      {children}
      <Footer />
    </>
  );
};

export default PlatformWrapper;
