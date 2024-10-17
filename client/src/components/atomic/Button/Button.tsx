import React, { FormEvent } from "react";
import styles from "./Button.module.scss";

export const buttonVariant = {
  primary: styles.primary,
  primaryOutline: styles.primaryOutline,
  primaryOutlineRed: styles.primaryOutlineRed,
  primaryFilled: styles.primaryFilled,
  almostGreen: styles.almostGreen,
  filter: styles.filter,
  primaryFilledSearch: styles.primaryFilledSearch,
  loginRegister: styles.loginRegister,
  logout: styles.logout,
};

type Props = {
  variant: keyof typeof buttonVariant;
  onClick?: () => void;
  children?: string | JSX.Element;
  submit?: boolean;
  disabled?: boolean;
  isClicked?: boolean;
  icon?: JSX.Element;
  rightIcon?: JSX.Element;
  leftIcon?: JSX.Element;
};

const Button: React.FC<Props> = ({
  children,
  onClick,
  submit,
  disabled,
  variant,
  isClicked,
  icon,
  rightIcon,
  leftIcon,
}) => {
  return (
    <button
      data-is-right-icon={rightIcon !== undefined}
      data-is-left-icon={leftIcon !== undefined}
      data-is-icon={icon !== undefined}
      data-is-clicked={isClicked}
      className={`${styles.button} ${buttonVariant[variant]}`}
      type={submit ? "submit" : "button"}
      onClick={() => onClick && onClick()}
      disabled={disabled}
    >
      {leftIcon && leftIcon}
      {icon && icon}
      {children}
      {rightIcon && rightIcon}
    </button>
  );
};

export default Button;
