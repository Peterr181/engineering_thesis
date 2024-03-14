import React from "react";
import styles from "./WhiteCardWrapper.module.scss";

type Props = {
  children: JSX.Element | JSX.Element[];
  additionalClass?: string;
};

const WhiteCardWrapper: React.FC<Props> = ({ children, additionalClass }) => {
  return (
    <div
      className={`${styles.wrapper} ${additionalClass ? additionalClass : ""}`}
    >
      {children}
    </div>
  );
};

export default WhiteCardWrapper;
