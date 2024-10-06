import React from "react";
import styles from "./Text.module.scss";

type Props = {
  children: string | undefined | JSX.Element;
  dontBrakeLine?: boolean;
  textStyle?: "xs" | "sm" | "md" | "lg" | "xl";
  boldness?: 500 | 600 | 700;
};

const Text: React.FC<Props> = (props) => {
  const { dontBrakeLine, textStyle, boldness, children } = props;

  const getFontWeightStyle = () => {
    switch (boldness) {
      case 500:
        return styles.fontWeight500;
      case 600:
        return styles.fontWeight600;
      case 700:
        return styles.fontWeight700;
      default:
        return "";
    }
  };

  return (
    <span
      style={{
        whiteSpace: dontBrakeLine ? "nowrap" : "pre-wrap",
        wordBreak: "break-word",
      }}
      className={`${styles.text} ${
        styles[textStyle || ""]
      } ${getFontWeightStyle()}`}
    >
      {children}
    </span>
  );
};

export default Text;
