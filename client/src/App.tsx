import "./App.scss";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<div>Login</div>} />
          <Route path="/register" element={<div>Register</div>} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
