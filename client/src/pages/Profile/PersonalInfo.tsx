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
import { useLanguage } from "../../context/LanguageProvider";

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
  const { t } = useLanguage();
  const { personalInfoData, updatePersonalInfo, loading, error } =
    usePersonalInfo();
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<PersonalInfoType | null>(
    null
  );
  const [editedValue, setEditedValue] = useState<string>("");
  const [showAlert, setShowAlert] = useState<boolean>(false);

  const labelMappings: { [key: string]: string } = {
    nickname: t("nickname"),
    favorite_training_type: t("favoriteTraining"),
    current_fitness_goals: t("currentFitnessGoals"),
    water_drunk_daily: t("waterDrunkDaily"),
    steps_daily: t("stepsDaily"),
    skill_level: t("skillLevel"),
    caloric_intake_goal: t("caloricIntakeGoal"),
    body_measurements: t("bodyMeasurements"),
    workout_frequency: t("workoutFrequency"),
    personal_bests: t("personalBests"),
    weight: t("weight"),
  };

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
      let updatedValue = editedValue;
      if (selectedItem.label === "weight") {
        updatedValue += " kg";
      } else if (selectedItem.label === "body_measurements") {
        updatedValue += " cm";
      }
      await updatePersonalInfo({ ...selectedItem, value: updatedValue });
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
        <h2>{t("personalInfo")}</h2>
        <p>{t("changePersonalInfo")}</p>
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
              <p>
                {info.value
                  ? info.label === "weight"
                    ? `${info.value} kg`
                    : info.label === "body_measurements"
                    ? `${info.value} cm`
                    : info.value
                  : t("noDataSet")}
              </p>
            </div>
          ))}
        </div>
      </div>

      <Dialog open={openDialog} onClose={handleClose}>
        <DialogTitle>
          {t("edit")} {labelMappings[selectedItem?.label || ""]}
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
          <Button onClick={handleClose}>{t("cancel")}</Button>
          <Button onClick={handleSave} color="primary">
            {t("save")}
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
          {t("settingUpdated")}
        </Alert>
      </Snackbar>
    </>
  );
};

export default PersonalInfo;
