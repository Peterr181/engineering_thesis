import React from "react";
import styles from "./MultistepForm.module.scss";
import { useLanguage } from "../../../context/LanguageProvider";

interface UpdateFields {
  nickname?: string;
  email?: string;
  password?: string;
  gender?: string;
  birthYear?: string;
}

interface UserBasicDataProps {
  nickname: string;
  email: string;
  password: string;
  gender: string;
  birthYear: string;
  updateFields: (fields: UpdateFields) => void;
}

const UserBasicData: React.FC<UserBasicDataProps> = ({
  email,
  nickname,
  gender,
  birthYear,
  password,
  updateFields,
}) => {
  const { t } = useLanguage();

  return (
    <div className={styles.userBasicInfo}>
      <div className={styles.userBasicInfo__intro}>
        <h2>{t("userBasicData.introTitle")}</h2>
        <p>{t("userBasicData.introDescription")}</p>
      </div>
      <label>{t("userBasicData.nicknameLabel")}</label>
      <input
        autoFocus
        required
        type="text"
        value={nickname}
        onChange={(e) => updateFields({ nickname: e.target.value })}
        placeholder={t("userBasicData.nicknamePlaceholder")}
      />
      <label>{t("userBasicData.emailLabel")}</label>
      <input
        required
        type="email"
        value={email}
        onChange={(e) => updateFields({ email: e.target.value })}
        placeholder={t("userBasicData.emailPlaceholder")}
      />
      <label>{t("userBasicData.passwordLabel")}</label>
      <input
        required
        type="password"
        value={password}
        onChange={(e) => updateFields({ password: e.target.value })}
        placeholder={t("userBasicData.passwordPlaceholder")}
      />
      <label>{t("userBasicData.genderLabel")}</label>
      <select
        required
        value={gender}
        onChange={(e) => updateFields({ gender: e.target.value })}
      >
        <option value="">{t("userBasicData.genderPlaceholder")}</option>
        <option value="male">{t("userBasicData.genderMale")}</option>
        <option value="female">{t("userBasicData.genderFemale")}</option>
      </select>
      <label>{t("userBasicData.birthYearLabel")}</label>
      <input
        required
        type="text"
        value={birthYear}
        onChange={(e) => updateFields({ birthYear: e.target.value })}
        placeholder={t("userBasicData.birthYearPlaceholder")}
        maxLength={4}
        pattern="\d{4}"
        title={t("userBasicData.birthYearTitle")}
      />
    </div>
  );
};

export default UserBasicData;
