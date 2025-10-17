import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Doctors from "./pages/Doctors";
import About from "./pages/About";
import Contact from "./pages/Contact";

// Admin Pages
import AdminDashboard from "./pages/AdminDashboard";
import AdminAppointments from "./pages/admin/AdminAppointments";
import AdminProfile from "./pages/admin/AdminProfile";
import ManageDoctors from "./pages/admin/ManageDoctors";

// Patient Appointment Pages
import BookAppointmentPage from "./pages/BookAppointmentPage";
import MyAppointmentsPage from "./pages/MyAppointmentsPage";
import PaymentsPage from "./pages/PaymentsPage";

import Payment from "./pages/Payment";
import "./styles/App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          {/* Patient Appointment Routes */}
          <Route path="/book-appointment" element={<BookAppointmentPage />} />
          <Route path="/my-appointments" element={<MyAppointmentsPage />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/payments" element={<PaymentsPage />} />

          {/* Admin Routes */}
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin/appointments" element={<AdminAppointments />} />
          <Route path="/admin/profile" element={<AdminProfile />} />
          <Route path="/admin/manage-doctors" element={<ManageDoctors />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;