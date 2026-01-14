import { BrowserRouter, Routes, Route } from "react-router-dom";
import Visit from "./pages/Visit";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import MyBookings from "./pages/MyBookings";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Visit />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/my-bookings" element={<MyBookings />} />
      </Routes>
    </BrowserRouter>
  );
}
