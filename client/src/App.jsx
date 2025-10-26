import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PublicLayout from "./layouts/PublicLayout";
import PrivateLayout from "./layouts/PrivateLayout";
import PrivateRoute from "./components/PrivateRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import DashBaord from "./pages/DashBaord";
import PetList from "./components/PetList";
import PetDetails from "./components/PetDetails";
import CreatePet from "./components/CreatePet";
import ProfileList from "./components/ProfileList";
import PublicPetCard from "./components/PublicPetCard";
import AdminLogin from "./admin/AdminLogin";

// ✅ New pages
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AdminDashboard from "./admin/AdminDashboard";
import FAQ from "./components/FAQ";
import AdminQR from "./admin/AdminQR";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register/:code" element={<Register />} />
          <Route path="*" element={<Register />} /> {/* fallback */}
          {/* Password Reset */}
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/FAQ" element={<FAQ />} />
        </Route>
        {/* Private Routes */}
        <Route
          element={
            <PrivateRoute>
              <PrivateLayout />
            </PrivateRoute>
          }
        >
          <Route path="/dashboard" element={<DashBaord />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/create" element={<CreatePet />} />
          <Route path="/all" element={<ProfileList />} />
          <Route path="/petlist" element={<PetList />} />
          <Route path="/pets/:petId" element={<PetDetails />} />
        </Route>

        {/* Catch-all for 404 */}

        <Route path="/pet/:petId" element={<PublicPetCard />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="admin/dashboard" element={<AdminDashboard />} />
        <Route path="/qr" element={<AdminQR />} />
      </Routes>
    </Router>
  );
}

export default App;
