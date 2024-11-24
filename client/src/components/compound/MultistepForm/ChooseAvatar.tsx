import React from "react";
import styles from "./ChooseAvatar.module.scss";
import avatar1 from "../../../assets/images/avatar1.png";
import avatar2 from "../../../assets/images/avatar2.png";
import avatar3 from "../../../assets/images/avatar3.png";
import avatar4 from "../../../assets/images/avatar4.png";
import avatar5 from "../../../assets/images/avatar5.png";
import avatar6 from "../../../assets/images/avatar6.png";
import { useLanguage } from "../../../context/LanguageProvider";

// Define avatars with labels and values
const avatars = [
  { label: "Avatar 1", value: "avatar1.png", imgSrc: avatar1, gender: "male" },
  { label: "Avatar 2", value: "avatar2.png", imgSrc: avatar2, gender: "male" },
  { label: "Avatar 3", value: "avatar3.png", imgSrc: avatar3, gender: "male" },
  {
    label: "Avatar 4",
    value: "avatar4.png",
    imgSrc: avatar4,
    gender: "female",
  },
  {
    label: "Avatar 5",
    value: "avatar5.png",
    imgSrc: avatar5,
    gender: "female",
  },
  {
    label: "Avatar 6",
    value: "avatar6.png",
    imgSrc: avatar6,
    gender: "female",
  },
];

interface ChooseAvatarProps {
  avatar: string;
  gender: string; // Add gender prop
  updateFields: (fields: Partial<{ avatar: string }>) => void;
}

const ChooseAvatar: React.FC<ChooseAvatarProps> = ({
  avatar,
  gender,
  updateFields,
}) => {
  const { t } = useLanguage();

  return (
    <div className={styles.chooseAvatar}>
      <div className={styles.avatarHeader}>
        <h2>{t("chooseAvatar.title")}</h2>
        <p>{t("chooseAvatar.description")}</p>
      </div>
      <div className={styles.avatarsContainer}>
        {avatars
          .filter(
            ({ gender: avatarGender }) => avatarGender === gender.toLowerCase()
          ) // Filter avatars based on gender
          .map(({ label, value, imgSrc }, index) => (
            <label key={index} className={styles.avatarOption}>
              <input
                type="radio"
                name="avatar"
                value={value} // Use the value for the database
                checked={avatar === value}
                onChange={() => updateFields({ avatar: value })} // Update only the filename
                style={{ display: "none" }} // Hide radio buttons
              />
              <img src={imgSrc} alt={label} className={styles.avatarImage} />
            </label>
          ))}
      </div>
    </div>
  );
};

export default ChooseAvatar;
