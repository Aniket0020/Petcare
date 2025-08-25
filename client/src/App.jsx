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

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
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
        <Route path="*" element={<div>Page not found</div>} />
        <Route path="/public/pet/:petId" element={<PublicPetCard />} />
      </Routes>
    </Router>
  );
}

export default App;
