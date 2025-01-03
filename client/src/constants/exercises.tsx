export const allExercises = (t: (key: string) => string) => [
  {
    workout_id: "cardio",
    name: t("exercisesList.Cardio"),
    type: t("exerciseTypes.Cardio"),
  },
  {
    workout_id: "yoga",
    name: t("exercisesList.Yoga"),
    type: t("exerciseTypes.Flexibility"),
  },
  {
    workout_id: "pilates",
    name: t("exercisesList.Pilates"),
    type: t("exerciseTypes.Flexibility"),
  },
  {
    workout_id: "crossfit",
    name: t("exercisesList.CrossFit"),
    type: t("exerciseTypes.Strength"),
  },
  {
    workout_id: "hiit",
    name: t("exercisesList.HIIT"),
    type: t("exerciseTypes.Cardio"),
  },
  {
    workout_id: "running",
    name: t("exercisesList.Running"),
    type: t("exerciseTypes.Cardio"),
  },
  {
    workout_id: "cycling",
    name: t("exercisesList.Cycling"),
    type: t("exerciseTypes.Cardio"),
  },
  {
    workout_id: "swimming",
    name: t("exercisesList.Swimming"),
    type: t("exerciseTypes.Cardio"),
  },
  {
    workout_id: "boxing",
    name: t("exercisesList.Boxing"),
    type: t("exerciseTypes.Combat"),
  },
  {
    workout_id: "weightlifting",
    name: t("exercisesList.Weightlifting"),
    type: t("exerciseTypes.Strength"),
  },
  {
    workout_id: "stretching",
    name: t("exercisesList.Stretching"),
    type: t("exerciseTypes.Flexibility"),
  },
  {
    workout_id: "bodybuilding",
    name: t("exercisesList.Bodybuilding"),
    type: t("exerciseTypes.Strength"),
  },
  {
    workout_id: "core_training",
    name: t("exercisesList.Core Training"),
    type: t("exerciseTypes.Strength"),
  },
  {
    workout_id: "dance",
    name: t("exercisesList.Dance"),
    type: t("exerciseTypes.Cardio"),
  },
  {
    workout_id: "kickboxing",
    name: t("exercisesList.Kickboxing"),
    type: t("exerciseTypes.Combat"),
  },
  {
    workout_id: "trx",
    name: t("exercisesList.TRX"),
    type: t("exerciseTypes.Strength"),
  },
  {
    workout_id: "powerlifting",
    name: t("exercisesList.Powerlifting"),
    type: t("exerciseTypes.Strength"),
  },
  {
    workout_id: "zumba",
    name: t("exercisesList.Zumba"),
    type: t("exerciseTypes.Cardio"),
  },
  {
    workout_id: "calisthenics",
    name: t("exercisesList.Calisthenics"),
    type: t("exerciseTypes.Strength"),
  },
  {
    workout_id: "gymnastics",
    name: t("exercisesList.Gymnastics"),
    type: t("exerciseTypes.Flexibility"),
  },
  {
    workout_id: "rowing",
    name: t("exercisesList.Rowing"),
    type: t("exerciseTypes.Cardio"),
  },
  {
    workout_id: "martial_arts",
    name: t("exercisesList.Martial Arts"),
    type: t("exerciseTypes.Combat"),
  },
  {
    workout_id: "aerobics",
    name: t("exercisesList.Aerobics"),
    type: t("exerciseTypes.Cardio"),
  },
  {
    workout_id: "resistance_training",
    name: t("exercisesList.Resistance Training"),
    type: t("exerciseTypes.Strength"),
  },
  {
    workout_id: "spin_class",
    name: t("exercisesList.Spin Class"),
    type: t("exerciseTypes.Cardio"),
  },
  {
    workout_id: "plyometrics",
    name: t("exercisesList.Plyometrics"),
    type: t("exerciseTypes.Strength"),
  },
  {
    workout_id: "barre",
    name: t("exercisesList.Barre"),
    type: t("exerciseTypes.Flexibility"),
  },
  {
    workout_id: "mobility_workouts",
    name: t("exercisesList.Mobility Workouts"),
    type: t("exerciseTypes.Flexibility"),
  },
];

export const months = (t: (key: string) => string) => [
  { label: "Jan", id: t("monthsList.January") },
  { label: "Feb", id: t("monthsList.February") },
  { label: "Mar", id: t("monthsList.March") },
  { label: "Apr", id: t("monthsList.April") },
  { label: "May", id: t("monthsList.May") },
  { label: "Jun", id: t("monthsList.June") },
  { label: "Jul", id: t("monthsList.July") },
  { label: "Aug", id: t("monthsList.August") },
  { label: "Sep", id: t("monthsList.September") },
  { label: "Oct", id: t("monthsList.October") },
  { label: "Nov", id: t("monthsList.November") },
  { label: "Dec", id: t("monthsList.December") },
];

export const roomIcons: { [key: string]: string } = {
  Cardio: "🏃‍♂️",
  Yoga: "🧘‍♀️",
  Pilates: "🤸‍♂️",
  CrossFit: "💪",
  HIIT: "🔥",
  Running: "🏃‍♀️",
  Cycling: "🚴‍♂️",
  Swimming: "🏊‍♂️",
  Boxing: "🥊",
  Weightlifting: "🏋️‍♂️",
  Stretching: "🧘‍♂️",
  Bodybuilding: "💪",
  CoreTraining: "🧘‍♀️",
  Dance: "💃",
  Kickboxing: "🥋",
  TRX: "🏋️‍♀️",
  Powerlifting: "🏋️‍♂️",
  Zumba: "🎶",
  Calisthenics: "🤸‍♀️",
  Gymnastics: "🤸‍♂️",
  Rowing: "🚣‍♂️",
  MartialArts: "🥋",
  Aerobics: "🕺",
  ResistanceTraining: "🏋️",
  SpinClass: "🚴",
  Plyometrics: "🏃‍♂️",
  Barre: "🩰",
  MobilityWorkouts: "🦵",
};
