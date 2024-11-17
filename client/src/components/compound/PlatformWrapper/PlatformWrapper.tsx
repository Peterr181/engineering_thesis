import React, { ReactNode } from "react";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar";

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
    </>
  );
};

export default PlatformWrapper;
