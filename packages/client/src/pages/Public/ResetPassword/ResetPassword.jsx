import React, { useState } from "react";
import { useFormik } from "formik";

import signUpSchema from "./reset-pass-schema";
import { sendPasswordResetEmail } from "../../../services/auth";
import Button from "../../../components/Button";
import Input from "../../../components/Input";

export default function ResetPassword() {
  const [resetPasswordError, setResetPasswordError] = useState(null);
  const [passwordResetSent, setPasswordResetSent] = useState(false);

  const config = {
    url: "http://localhost:3000/",
    handleCodeInApp: true,
  };
  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: signUpSchema,
    onSubmit: async (form) => {
      setPasswordResetSent(false);
      setResetPasswordError(null);

      try {
        await sendPasswordResetEmail(form.email, config);
        setPasswordResetSent(true);
      } catch (error) {
        setResetPasswordError(error.message);
      }
    },
  });

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <div className="fnt-subtitle-bold">Password recovery</div>

        <Input
          label="email"
          id="email"
          name="email"
          type="email"
          classNames="col mb-3 col-12 col-sm-8 col-md-5"
          placeholder="name@example.com"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.email}
          errorMessage={formik.errors.email || resetPasswordError}
          hasErrorMessage={formik.touched.email || resetPasswordError}
        />

        {passwordResetSent && !resetPasswordError ? (
          <p className="">
            Please visit your email to continue with password recovery
          </p>
        ) : (
          <p>&nbsp;</p>
        )}

        <Button isNegative submitButton>
          Reset password
        </Button>
      </form>
    </>
  );
}
