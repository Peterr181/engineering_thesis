import styles from "./EmailPassword.module.scss";
import { Button, TextField } from "@mui/material";
import { useState } from "react";
import useAuth from "../../hooks/useAuth";
import { useLogin } from "../../hooks/useLogin";
import { useForm, Controller } from "react-hook-form";
import { useLanguage } from "../../context/LanguageProvider";

const EmailPassword = () => {
  const userProfile = useAuth();
  const { handlePasswordChange, error, loading } = useLogin();
  const { t } = useLanguage();

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
      setErrorMessage(t("error.newPasswordsDoNotMatch"));
      return;
    }

    const result = await handlePasswordChange(
      currentPassword,
      newPassword,
      repeatPassword
    );

    if (result && result.status === "Success") {
      reset();
      setSuccessMessage(t("success.passwordChanged"));

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
          <h2>{t("emailPassword.title")}</h2>
          <p>{t("emailPassword.description")}</p>
        </div>
        <div className={styles.saveChanges}>
          <Button
            variant="contained"
            color="success"
            onClick={handleSubmit(onSubmit)}
            disabled={loading}
          >
            {loading
              ? t("emailPassword.saving")
              : t("emailPassword.saveChanges")}
          </Button>
        </div>
      </div>

      <div className={styles.emailpassword__box}>
        <div className={styles.emailpassword__box__item}>
          <label className={styles.inputLabel}>
            {t("emailPassword.email")}
          </label>
          <TextField
            id="outlined-email"
            label={t("emailPassword.email")}
            variant="outlined"
            value={userProfile?.email || ""}
            className={styles.emailpassword__textfield}
            InputProps={{ readOnly: true }}
          />
        </div>

        <div className={styles.emailpassword__box__item}>
          <label className={styles.inputLabel}>
            {t("emailPassword.currentPassword")}
          </label>
          <Controller
            name="currentPassword"
            control={control}
            rules={{ required: t("emailPassword.currentPasswordRequired") }}
            render={({ field }) => (
              <TextField
                {...field}
                id="outlined-password-actual"
                label={t("emailPassword.currentPassword")}
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
          <label className={styles.inputLabel}>
            {t("emailPassword.newPassword")}
          </label>
          <Controller
            name="newPassword"
            control={control}
            rules={{
              required: t("emailPassword.newPasswordRequired"),
              minLength: {
                value: 12,
                message: t("emailPassword.passwordMinLength"),
              },
              pattern: {
                value: /[^A-Za-z0-9]/,
                message: t("emailPassword.passwordSpecialChar"),
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                id="outlined-password"
                label={t("emailPassword.newPassword")}
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
          <label className={styles.inputLabel}>
            {t("emailPassword.repeatNewPassword")}
          </label>
          <Controller
            name="repeatPassword"
            control={control}
            rules={{ required: t("emailPassword.repeatPasswordRequired") }}
            render={({ field }) => (
              <TextField
                {...field}
                id="outlined-repeat-password"
                label={t("emailPassword.repeatNewPassword")}
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
