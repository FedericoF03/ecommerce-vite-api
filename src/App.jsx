import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Register from "./Routes/Register";
import Home from "./Routes/Home";
import Login from "./Routes/login";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth/authorization" element={<Login />} />
          <Route path="/auth/authorization" element={<Register />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
