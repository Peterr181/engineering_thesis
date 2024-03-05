import { ReactNode } from "react";
import "./MaxWidthWrapper.scss";

const MaxWidthWrapper = ({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) => {
  const wrapperClassName = `max-width-wrapper ${className || ""}`;

  return <div className={wrapperClassName.trim()}>{children}</div>;
};

export default MaxWidthWrapper;
