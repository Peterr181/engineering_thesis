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
import ChatRoom from "./components/compound/ChatRoom/ChatRoom";
import ProtectedRoute from "./context/ProtectedRoute";

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={<ProtectedRoute element={<Home />} unprotected />}
          />
          <Route
            path="/register"
            element={<ProtectedRoute element={<Register />} unprotected />}
          />
          <Route
            path="/login"
            element={<ProtectedRoute element={<Login />} unprotected />}
          />
          <Route
            path="/workouts"
            element={<ProtectedRoute element={<Exercises />} />}
          />
          <Route
            path="/workoutplan"
            element={<ProtectedRoute element={<WorkoutPlan />} />}
          />
          <Route
            path="/creatingworkout"
            element={<ProtectedRoute element={<CreatingWorkout />} />}
          />
          <Route
            path="/personaldetails"
            element={<ProtectedRoute element={<PersonalGoals />} />}
          />
          <Route
            path="/chatrooms"
            element={<ProtectedRoute element={<ChatRooms />} />}
          />
          <Route
            path="/chat/:roomId"
            element={<ProtectedRoute element={<ChatRoom />} />}
          />
          <Route
            path="/mealsplan"
            element={<ProtectedRoute element={<MealsPlan />} />}
          />
          <Route
            path="/finder"
            element={<ProtectedRoute element={<Finder />} />}
          />
          <Route
            path="/meals"
            element={<ProtectedRoute element={<Meals />} />}
          />
          <Route
            path="/profile"
            element={<ProtectedRoute element={<Profile />} />}
          />
          <Route
            path="/multistepregister"
            element={<ProtectedRoute element={<MultistepForm />} />}
          />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;
