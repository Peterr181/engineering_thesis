import "./App.scss";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import { LanguageProvider } from "./context/LanguageProvider";

import Exercises from "./pages/Exercises/Exercises";
function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/workouts" element={<Exercises />} />
          <Route path="/login" element={<div>Login</div>} />
          <Route path="/register" element={<div>Register</div>} />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;
