import "./App.scss";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import { LanguageProvider } from "./context/LanguageProvider";
import Exercises from "./pages/Exercises/Exercises";
import Meals from "./pages/Meals/Meals";
import Finder from "./pages/Finder/Finder";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import MultistepForm from "./components/compound/MultistepForm/MultistepForm";
import WorkoutPlan from "./pages/WorkoutPlan/WorkoutPlan";
import CreatingWorkout from "./pages/CreatingWorkout/CreatingWorkout";
import MealsPlan from "./pages/MealsPlan/MealsPlan";
import ChatRooms from "./pages/ChatRooms/ChatRooms";
import Profile from "./pages/Profile/Profile";
import PersonalGoals from "./components/compound/MultistepForm/PersonalGoals";

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/workouts" element={<Exercises />} />
          <Route path="/workoutplan" element={<WorkoutPlan />} />
          <Route path="/creatingworkout" element={<CreatingWorkout />} />
          <Route path="/personaldetails" element={<PersonalGoals />} />
          <Route path="/mealsplan" element={<MealsPlan />} />
          <Route path="/finder" element={<Finder />} />
          <Route path="/chatrooms" element={<ChatRooms />} />
          <Route path="/meals" element={<Meals />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/multistepregister" element={<MultistepForm />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;
