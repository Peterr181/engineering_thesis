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
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material";
import { usePersonalInfo, PersonalInfoType } from "../../hooks/usePersonalInfo";

const labelMappings: { [key: string]: string } = {
  nickname: "Nickname",
  favorite_training_type: "Favorite Training",
  current_fitness_goals: "Current Fitness Goals",
  water_drunk_daily: "Water Drunk Daily",
  steps_daily: "Steps Daily",
  skill_level: "Level of Skill in Sports",
  caloric_intake_goal: "Daily Caloric",
  body_measurements: "Height",
  workout_frequency: "Workout Frequency",
  personal_bests: "Personal Bests",
  weight: "Weight",
};

const icons: { [key: string]: JSX.Element } = {
  nickname: iconFile.profileColorIcon,
  favorite_training_type: iconFile.trainingColorIcon,
  current_fitness_goals: iconFile.goalColorIcon,
  water_drunk_daily: iconFile.waterColorIcon,
  steps_daily: iconFile.stepsColorIcon,
  skill_level: iconFile.skillColorIcon,
  caloric_intake_goal: iconFile.mealColorIcon,
  body_measurements: iconFile.heightColorIcon,
  workout_frequency: iconFile.timeColorIcon,
  personal_bests: iconFile.personalColorIcon,
  weight: iconFile.weightColorIcon,
};

const PersonalInfo: React.FC = () => {
  const { personalInfoData, updatePersonalInfo, loading, error } =
    usePersonalInfo();
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<PersonalInfoType | null>(
    null
  );
  const [editedValue, setEditedValue] = useState<string>("");
  const [showAlert, setShowAlert] = useState<boolean>(false);

  const handleItemClick = (item: PersonalInfoType) => {
    setSelectedItem(item);
    setEditedValue(item.value || "");
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
    setSelectedItem(null);
    setEditedValue("");
  };

  const handleSave = async () => {
    if (selectedItem) {
      await updatePersonalInfo({ ...selectedItem, value: editedValue });
      handleClose();
      setShowAlert(true);
    }
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <>
      <div className={styles.profile__data}>
        <h2>Personal Info</h2>
        <p>Change your personal informations that are very important here!</p>
        <div className={styles.profile__data__box}>
          {personalInfoData.map((info, index) => (
            <div
              key={index}
              className={styles.profile__data__box__item}
              onClick={() => handleItemClick(info)}
              style={{ cursor: "pointer" }}
            >
              <label>
                <span>{labelMappings[info.label] || info.label}</span>{" "}
                <span>{icons[info.label]}</span>{" "}
              </label>
              <p>{info.value || "No data set"}</p>
            </div>
          ))}
        </div>
      </div>

      <Dialog open={openDialog} onClose={handleClose}>
        <DialogTitle>
          Edit {labelMappings[selectedItem?.label || ""]}
        </DialogTitle>
        <DialogContent>
          <div className={styles.dialogContent}>
            <TextField
              fullWidth
              label={labelMappings[selectedItem?.label || ""]}
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

      <Snackbar
        open={showAlert}
        autoHideDuration={3000}
        onClose={() => setShowAlert(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={() => setShowAlert(false)} severity="success">
          Setting updated successfully!
        </Alert>
      </Snackbar>
    </>
  );
};

export default PersonalInfo;
