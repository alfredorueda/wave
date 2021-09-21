import React from "react";

import "./Button.scss";

export default function Button({
  primaryBtn = true,
  secondaryBtn = false,
  isNegative = false,
  isSmall = false,
  fullWidth = false,
  submitButton = false,
  disabled = false,
  children,
  handleClick = () => {},
  ...props
}) {
  let classNames = "custom-btn fx-rounded ";

  if (isSmall) {
    classNames += "fnt-caption small-btn";
  } else {
    classNames += "fnt-label-bold large-btn ";
    if (primaryBtn && !isNegative && !secondaryBtn) {
      classNames += "positive-primary-btn";
    } else if (primaryBtn && isNegative && !secondaryBtn) {
      classNames += "negative-primary-btn";
    } else if (secondaryBtn && !isNegative) {
      classNames += "positive-secondary-btn";
    } else {
      classNames += "negative-secondary-btn";
    }
  }

  if (fullWidth) {
    classNames += " w-100";
  }

  return (
    <button
      className={classNames}
      type={submitButton ? "submit" : "button"}
      disabled={disabled}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
}
