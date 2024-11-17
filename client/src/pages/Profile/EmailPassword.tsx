import styles from "./EmailPassword.module.scss";
import { Button, TextField } from "@mui/material";
import { useState } from "react";
import useAuth from "../../hooks/useAuth";
import { useLogin } from "../../hooks/useLogin";
import { useForm, Controller } from "react-hook-form";

const EmailPassword = () => {
  const userProfile = useAuth();
  const { handlePasswordChange, error, loading } = useLogin();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      repeatPassword: "",
    },
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(error);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  interface FormData {
    currentPassword: string;
    newPassword: string;
    repeatPassword: string;
  }

  const onSubmit = async (data: FormData) => {
    setErrorMessage(null);
    setSuccessMessage(null);

    const { currentPassword, newPassword, repeatPassword } = data;

    if (newPassword !== repeatPassword) {
      setErrorMessage("New passwords do not match.");
      return;
    }

    const result = await handlePasswordChange(
      currentPassword,
      newPassword,
      repeatPassword
    );

    if (result && result.status === "Success") {
      reset();
      setSuccessMessage("Your password has been successfully changed!");

      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
    } else if (result && result.error) {
      setErrorMessage(result.error);
    }
  };

  if (errorMessage) {
    setTimeout(() => {
      setErrorMessage(null);
    }, 5000);
  }

  return (
    <div className={styles.emailpassword}>
      <div className={styles.emailpassword__header}>
        <div>
          <h2>Email & Password</h2>
          <p>
            Change your profile security data, password must contain 12
            characters and one special character
          </p>
        </div>
        <div className={styles.saveChanges}>
          <Button
            variant="contained"
            color="success"
            onClick={handleSubmit(onSubmit)}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save changes"}
          </Button>
        </div>
      </div>

      <div className={styles.emailpassword__box}>
        <div className={styles.emailpassword__box__item}>
          <label className={styles.inputLabel}>Email</label>
          <TextField
            id="outlined-email"
            label="Email"
            variant="outlined"
            value={userProfile?.email || ""}
            className={styles.emailpassword__textfield}
            InputProps={{ readOnly: true }}
          />
        </div>

        <div className={styles.emailpassword__box__item}>
          <label className={styles.inputLabel}>Current Password</label>
          <Controller
            name="currentPassword"
            control={control}
            rules={{ required: "Current password is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                id="outlined-password-actual"
                label="Current Password"
                variant="outlined"
                type="password"
                className={styles.emailpassword__textfield}
                error={!!errors.currentPassword}
                helperText={errors.currentPassword?.message}
              />
            )}
          />
        </div>

        <div className={styles.emailpassword__box__item}>
          <label className={styles.inputLabel}>New Password</label>
          <Controller
            name="newPassword"
            control={control}
            rules={{
              required: "New password is required",
              minLength: {
                value: 12,
                message: "Password must be at least 12 characters long",
              },
              pattern: {
                value: /[^A-Za-z0-9]/,
                message: "Password must contain at least one special character",
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                id="outlined-password"
                label="New Password"
                variant="outlined"
                type="password"
                className={styles.emailpassword__textfield}
                error={!!errors.newPassword}
                helperText={errors.newPassword?.message}
              />
            )}
          />
        </div>

        <div className={styles.emailpassword__box__item}>
          <label className={styles.inputLabel}>Repeat New Password</label>
          <Controller
            name="repeatPassword"
            control={control}
            rules={{ required: "Please repeat the new password" }}
            render={({ field }) => (
              <TextField
                {...field}
                id="outlined-repeat-password"
                label="Repeat New Password"
                variant="outlined"
                type="password"
                className={styles.emailpassword__textfield}
                error={!!errors.repeatPassword}
                helperText={errors.repeatPassword?.message}
              />
            )}
          />
        </div>
      </div>

      {/* Show error message if there's any */}
      {errorMessage && <p className={styles.error}>{errorMessage}</p>}

      {/* Show success message if password was changed successfully */}
      {successMessage && <p className={styles.success}>{successMessage}</p>}
    </div>
  );
};

export default EmailPassword;
