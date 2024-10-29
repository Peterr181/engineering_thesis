import React from "react";
import styles from "./MultistepForm.module.scss";

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
  return (
    <div className={styles.userBasicInfo}>
      <div className={styles.userBasicInfo__intro}>
        <h2>We can't wait to meet you.</h2>
        <p>
          Please fill in the details below so that we can get in contact with
          you.
        </p>
      </div>
      <label>Nickname</label>
      <input
        autoFocus
        required
        type="text"
        value={nickname}
        onChange={(e) => updateFields({ nickname: e.target.value })}
        placeholder="Nickname"
      />
      <label>Email</label>
      <input
        required
        type="email"
        value={email}
        onChange={(e) => updateFields({ email: e.target.value })}
        placeholder="example@gmail.com"
      />
      <label>Password</label>
      <input
        required
        type="password"
        value={password}
        onChange={(e) => updateFields({ password: e.target.value })}
        placeholder="●●●●●●"
      />
      <label>Gender</label>
      <select
        required
        value={gender}
        onChange={(e) => updateFields({ gender: e.target.value })}
      >
        <option value="">Select Gender</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select>
      <label>Birth Year</label>
      <input
        required
        type="text"
        value={birthYear}
        onChange={(e) => updateFields({ birthYear: e.target.value })}
        placeholder="YYYY"
        maxLength={4}
        pattern="\d{4}"
        title="Please enter a valid 4-digit year"
      />
    </div>
  );
};

export default UserBasicData;
