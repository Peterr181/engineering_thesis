import React, { useState } from "react";
import { iconFile } from "../../assets/iconFile";
import styles from "./Profile.module.scss";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
} from "@mui/material";

export interface PersonalInfo {
  label: string;
  value: string;
  icon: JSX.Element;
}

const initialPersonalInfoData: PersonalInfo[] = [
  { label: "Nickname", value: "JohnDoe123", icon: iconFile.profileColorIcon },
  {
    label: "Favorite Training Type",
    value: "Gym",
    icon: iconFile.trainingColorIcon,
  },
  {
    label: "Current Fitness Goals",
    value: "Build muscle, run 5k in under 25 mins",
    icon: iconFile.goalColorIcon,
  },
  {
    label: "Water Drunk Daily",
    value: "2.5 liters",
    icon: iconFile.waterColorIcon,
  },
  {
    label: "Number of Steps Daily",
    value: "8,000 steps",
    icon: iconFile.stepsColorIcon,
  },
  {
    label: "Level of Skill in Sports",
    value: "Intermediate",
    icon: iconFile.skillColorIcon,
  },
  {
    label: "Daily Caloric Intake Goal",
    value: "2,500 kcal",
    icon: iconFile.mealColorIcon,
  },
  {
    label: "Body Measurements",
    value: "Weight: 75kg, Height: 180cm",
    icon: iconFile.weightColorIcon,
  },
  {
    label: "Workout Frequency",
    value: "5 times a week",
    icon: iconFile.timeColorIcon,
  },
  {
    label: "Personal Bests",
    value: "Deadlift: 150kg, 5km Run: 24:30 mins",
    icon: iconFile.personalColorIcon,
  },
];

const PersonalInfo: React.FC = () => {
  const [personalInfoData, setPersonalInfoData] = useState<PersonalInfo[]>(
    initialPersonalInfoData
  );
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<PersonalInfo | null>(null);
  const [editedValue, setEditedValue] = useState<string>("");

  const handleItemClick = (item: PersonalInfo) => {
    setSelectedItem(item);
    setEditedValue(item.value);
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
    setSelectedItem(null);
    setEditedValue("");
  };

  const handleSave = () => {
    if (selectedItem) {
      const updatedData = personalInfoData.map((info) =>
        info.label === selectedItem.label
          ? { ...info, value: editedValue }
          : info
      );
      setPersonalInfoData(updatedData);
      handleClose();
    }
  };

  return (
    <>
      <div className={styles.profile__data}>
        <h2>Personal Info</h2>
        <div className={styles.profile__data__box}>
          {personalInfoData.map((info, index) => (
            <div
              key={index}
              className={styles.profile__data__box__item}
              onClick={() => handleItemClick(info)}
              style={{ cursor: "pointer" }}
            >
              <label>
                <span>{info.label}</span>
                <span>{info.icon}</span>
              </label>
              <p>{info.value}</p>
            </div>
          ))}
        </div>
      </div>

      <Dialog open={openDialog} onClose={handleClose}>
        <DialogTitle>Edit {selectedItem?.label}</DialogTitle>
        <DialogContent>
          <div className={styles.dialogContent}>
            <TextField
              fullWidth
              label={selectedItem?.label}
              value={editedValue}
              onChange={(e) => setEditedValue(e.target.value)}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PersonalInfo;
